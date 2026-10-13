import numpy as np
from PIL import Image
from pathlib import Path

ASSETS = Path(r"C:\english-quest\assets")
p = ASSETS / "OBJ_hat_box.png"
im = Image.open(p).convert("RGBA")
a = np.array(im).astype(np.int16)
r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3]
maxc = a[..., :3].max(axis=2)

sky = ((b - r > 30) & (b > 120) & (al > 0)) | ((b - r > 15) & (b > 120) & (al < 255) & (al > 0))
a[..., 3][sky] = 0

boxlike = ((r - g > 50) & (r > 120) & (al > 0)) | ((maxc < 95) & (al > 0))
h, w = al.shape
cut_px = 0
for x in range(w):
    col = boxlike[:, x]
    ys = np.flatnonzero(col)
    if ys.size == 0:
        cut_px += int((a[:, x, 3] > 0).sum())
        a[:, x, 3] = 0
    else:
        y0 = ys[0]
        if y0 > 0:
            cut_px += int((a[:y0, x, 3] > 0).sum())
            a[:y0, x, 3] = 0

out = Image.fromarray(a.astype(np.uint8), "RGBA")
bbox = out.getchannel("A").getbbox()
if bbox:
    out = out.crop(bbox)
out.save(p)
print(f"OBJ_hat_box: sky={int(sky.sum())}px, column-cut={cut_px}px -> {out.size}")
