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

dark = maxc < 60
pinkish = (r - g > 50) & (g < 180) & (r > 120)
boxlike = (dark | pinkish) & (al > 0)

h, w = al.shape
cut_px = 0
zero_cols = 0
for x in range(w):
    ys = np.flatnonzero(boxlike[:, x])
    if ys.size == 0:
        cut_px += int((a[:, x, 3] > 0).sum())
        a[:, x, 3] = 0
        zero_cols += 1
    else:
        y0 = int(ys[0])
        if y0 > 0:
            cut_px += int((a[:y0, x, 3] > 0).sum())
            a[:y0, x, 3] = 0

out = Image.fromarray(a.astype(np.uint8), "RGBA")
bbox = out.getchannel("A").getbbox()
if bbox:
    out = out.crop(bbox)
out.save(p)
print(f"OBJ_hat_box: cyan={int(cyanish.sum())}px, cut={cut_px}px, zero-columns={zero_cols} -> {out.size}")
