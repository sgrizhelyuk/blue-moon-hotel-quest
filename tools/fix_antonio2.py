import shutil
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ASSETS = Path(r"C:\english-quest\assets")
VERS = ASSETS / "_versions"
src = ASSETS / "CH_antonio.png"
shutil.copyfile(src, VERS / "CH_antonio_pre_facefix2.png")

im = Image.open(src).convert("RGBA")
a = np.array(im)
al = a[..., 3].astype(np.uint8)

m0 = al >= 40
core = ndimage.binary_opening(m0, iterations=3)
lab, n = ndimage.label(core)
sizes = np.bincount(lab.ravel())
sizes[0] = 0
main = lab == sizes.argmax()
filled = ndimage.binary_fill_holes(main)
interior = ndimage.binary_erosion(filled, iterations=2)
region = ndimage.binary_dilation(filled, iterations=8)

new_al = np.zeros_like(al)
keep = region & (al > 0)
new_al[keep] = al[keep]
new_al[interior] = 255
a[..., 3] = new_al

out = Image.fromarray(a, "RGBA")
bbox = out.getchannel("A").getbbox()
if bbox:
    out = out.crop(bbox)
out.save(src)

arr = np.array(out)
semi = int(((arr[..., 3] > 0) & (arr[..., 3] < 255)).sum())
h, w = arr.shape[:2]
face = arr[int(h * 0.05):int(h * 0.30), int(w * 0.3):int(w * 0.7), 3]
face_semi = int(((face > 0) & (face < 255)).sum())
print(f"CH_antonio: -> {out.size}, semi total {semi}, semi in face {face_semi}")
