from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path(r"C:\english-quest\assets")
src = ASSETS / "CH_antonio.png"

im = Image.open(src).convert("RGBA")
a = np.array(im)
al = a[..., 3]

regions = [
    (85, 170, 235, 470),    # left twig cluster
    (585, 660, 285, 455),   # right twig
    (20, 58, 830, 905)      # bottom-left swirl
]
removed = 0
for x0, x1, y0, y1 in regions:
    sub = al[y0:y1, x0:x1]
    m = (sub > 0) & (sub < 220)
    removed += int(m.sum())
    sub[m] = 0

out = Image.fromarray(a, "RGBA")
bbox = out.getchannel("A").getbbox()
if bbox:
    out = out.crop(bbox)
out.save(src)
arr = np.array(out)
print(f"CH_antonio: removed {removed} semi px in twig zones -> {out.size}, semi now {int(((arr[...,3]>0)&(arr[...,3]<255)).sum())}")
