import numpy as np
from PIL import Image
from scipy import ndimage
from pathlib import Path

ASSETS = Path(r"C:\english-quest\assets")
VERS = ASSETS / "_versions"
src = ASSETS / "CH_antonio.png"

cur = Image.open(src).convert("RGBA")
orig = Image.open(VERS / "pre_rembg" / "CH_antonio.png").convert("RGB")
ca = np.array(cur)
oa = np.array(orig)
DX, DY = 44, 60
h, w = ca.shape[:2]
al = ca[..., 3].astype(np.int32)
rgb = ca[..., :3].astype(np.float32)
src_rgb = oa[DY:DY + h, DX:DX + w].astype(np.float32)

mask = al > 0
filled = ndimage.binary_fill_holes(mask)
holes = filled & (al == 0)
print("holes filled:", int(holes.sum()))
rgb[holes] = src_rgb[holes]
al[holes] = 255

zone = np.zeros(al.shape, bool)
zone[0:140, 235:485] = True
zsemi = zone & (al > 0) & (al < 255)
rgb[zsemi] = src_rgb[zsemi]
al[zsemi & (al >= 8)] = 255

out = np.dstack([rgb.clip(0, 255).astype(np.uint8), al.astype(np.uint8)])
img = Image.fromarray(out, "RGBA")
img.save(src)
print("saved", img.size)

comp_dark = Image.new("RGBA", img.size, (20, 20, 24, 255))
comp_dark.alpha_composite(img)
comp_dark.convert("RGB").crop((150, 0, 600, 400)).resize((675, 600), Image.LANCZOS).save(
    r"C:\Users\73B5~1\AppData\Local\Temp\opencode\antonio_dark_head3.png")
comp_lite = Image.new("RGBA", img.size, (240, 240, 240, 255))
comp_lite.alpha_composite(img)
comp_lite.convert("RGB").resize((354, 562), Image.LANCZOS).save(
    r"C:\Users\73B5~1\AppData\Local\Temp\opencode\antonio_light_full3.png")
print("previews saved")
