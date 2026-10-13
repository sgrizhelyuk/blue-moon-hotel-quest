import numpy as np
from PIL import Image
from pathlib import Path

p = Path(r"C:\english-quest\assets\OBJ_hat_box.png")
im = Image.open(p).convert("RGBA")
a = np.array(im).astype(np.int16)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
maxc = a[..., :3].max(axis=2)

cyanish = (b - r > 18) & (b > 95) & (g > 95) & (al > 0)
a[..., 3][cyanish] = 0

pink = (r - g > 50) & (g < 180) & (r > 120) & (al > 0)
dark = (maxc < 60) & (al > 0)

face_cols = np.flatnonzero(pink[80:160, :].any(axis=0))
if face_cols.size:
    fx0, fx1 = face_cols.min(), face_cols.max()
else:
    fx0 = fx1 = 0
knob_cols = (int(fx0) - 16, int(fx1) + 16)
print("face x:", fx0, fx1, "knob cols:", knob_cols)

h, w = al.shape
cut_px = 0
for x in range(w):
    ys = np.flatnonzero(pink[:, x])
    y0p = int(ys[0]) if ys.size else None
    y0 = y0p
    if knob_cols[0] <= x <= knob_cols[1]:
        dys = np.flatnonzero(dark[:, x])
        runs = []
        if dys.size:
            start = prev = int(dys[0])
            for yy in dys[1:]:
                yy = int(yy)
                if yy == prev + 1:
                    prev = yy
                else:
                    runs.append((start, prev))
                    start = prev = yy
            runs.append((start, prev))
        runs2 = [rn for rn in runs if rn[1] >= 30]
        if runs2:
            y0 = runs2[0][0]
    if y0 is None:
        cut_px += int((a[:, x, 3] > 0).sum())
        a[:, x, 3] = 0
    elif y0 > 0:
        cut_px += int((a[:y0, x, 3] > 0).sum())
        a[:y0, x, 3] = 0

out = Image.fromarray(a.astype(np.uint8), "RGBA")
bbox = out.getchannel("A").getbbox()
if bbox:
    out = out.crop(bbox)
out.save(p)
print(f"OBJ_hat_box: cyan={int(cyanish.sum())}, cut={cut_px}px -> {out.size}")
