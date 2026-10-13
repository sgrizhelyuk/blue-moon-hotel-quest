import numpy as np
from PIL import Image
from pathlib import Path

p = Path(r"C:\english-quest\assets\OBJ_hat_box.png")
im = Image.open(p).convert("RGBA")
a = np.array(im).astype(np.int16)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
maxc = a[..., :3].max(axis=2)

pink = (r - g > 50) & (g < 180) & (r > 120) & (g - b < 15) & (al > 0)
dark = (maxc < 60) & (al > 0)

KX0, KX1 = 292, 398
h, w = al.shape
cut_px = 0
for x in range(w):
    ys = np.flatnonzero(pink[:, x])
    y0p = int(ys[0]) if ys.size else None
    y0 = y0p
    if KX0 <= x <= KX1:
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
        elif y0p is None:
            y0 = 40
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
print(f"OBJ_hat_box: cut={cut_px}px -> {out.size}")
