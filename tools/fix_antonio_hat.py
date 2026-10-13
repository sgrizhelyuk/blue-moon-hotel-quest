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

r, g, b = src_rgb[..., 0], src_rgb[..., 1], src_rgb[..., 2]
red = (r > 140) & (r - g > 60) & (r - b > 40)
already = al >= 250
zone = np.zeros(al.shape, bool)
zone[0:140, 235:485] = True
m = (red | already) & zone
lab, n = ndimage.label(m)
sizes = np.bincount(lab.ravel())
sizes[0] = 0
toque = lab == sizes.argmax()
toque = ndimage.binary_fill_holes(toque) & zone
print("toque px:", int(toque.sum()))

rgb[toque] = src_rgb[toque]
al[toque] = 255

out = np.dstack([rgb.clip(0, 255).astype(np.uint8), al.astype(np.uint8)])
img = Image.fromarray(out, "RGBA")
img.save(src)
print("saved", img.size)

comp_dark = Image.new("RGBA", img.size, (20, 20, 24, 255))
comp_dark.alpha_composite(img)
comp_dark.convert("RGB").crop((150, 0, 600, 400)).resize((675, 600), Image.LANCZOS).save(
    r"C:\Users\73B5~1\AppData\Local\Temp\opencode\antonio_hat_dark.png")
comp_lite = Image.new("RGBA", img.size, (240, 240, 240, 255))
comp_lite.alpha_composite(img)
comp_lite.convert("RGB").resize((354, 562), Image.LANCZOS).save(
    r"C:\Users\73B5~1\AppData\Local\Temp\opencode\antonio_hat_light.png")
print("previews saved")
