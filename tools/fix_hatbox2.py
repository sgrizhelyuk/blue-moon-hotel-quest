import shutil
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ASSETS = Path(r"C:\english-quest\assets")
VERS = ASSETS / "_versions"


def clean_small(arr, min_px=300):
    mask = arr[..., 3] > 0
    lab, n = ndimage.label(mask)
    sizes = np.bincount(lab.ravel())
    small = np.zeros(n + 1, dtype=bool)
    small[1:] = sizes[1:] < min_px
    arr[..., 3][small[lab]] = 0
    return arr


def border_component_mask(crit):
    lab, n = ndimage.label(crit)
    border_ids = set()
    for arr_idx in (lab[0], lab[-1], lab[:, 0], lab[:, -1]):
        border_ids.update(arr_idx[arr_idx > 0].tolist())
    out = np.zeros_like(crit)
    for bid in border_ids:
        out |= lab == bid
    return out


shutil.copyfile(VERS / "OBJ_hat_box_u2net.png", ASSETS / "OBJ_hat_box.png")

im = Image.open(ASSETS / "OBJ_hat_box.png").convert("RGBA")
a = np.array(im).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
alpha = a[..., 3]

sky = (b - r > 30) & (r < 170) & (b > 135) & (alpha > 0)
cloud = (r - b > 20) & (r > 200) & (g > 190) & (alpha > 0)

rem_sky = border_component_mask(sky)
rem_cloud = border_component_mask(cloud)
a[..., 3][rem_sky] = 0
a[..., 3][rem_cloud] = 0
a = clean_small(a, 300)

out = Image.fromarray(a.astype(np.uint8), "RGBA")
bbox = out.getchannel("A").getbbox()
if bbox:
    out = out.crop(bbox)
out.save(ASSETS / "OBJ_hat_box.png")
print(f"OBJ_hat_box: sky={int(rem_sky.sum())}px cloud={int(rem_cloud.sum())}px -> {out.size}")

im2 = Image.open(ASSETS / "OBJ_broken_glass.png").convert("RGBA")
a2 = np.array(im2).astype(np.int16)
alpha2 = a2[..., 3]
maxc = a2[..., :3].max(axis=2)
residue = (alpha2 > 0) & (alpha2 < 255) & (maxc < 120)
a2[..., 3][residue] = 0
a2 = clean_small(a2, 40)
out2 = Image.fromarray(a2.astype(np.uint8), "RGBA")
bbox2 = out2.getchannel("A").getbbox()
if bbox2:
    out2 = out2.crop(bbox2)
out2.save(ASSETS / "OBJ_broken_glass.png")
print(f"OBJ_broken_glass: residue={int(residue.sum())}px -> {out2.size}")
