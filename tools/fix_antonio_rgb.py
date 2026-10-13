import shutil
from pathlib import Path

import numpy as np
from PIL import Image

ASSETS = Path(r"C:\english-quest\assets")
VERS = ASSETS / "_versions"
src = ASSETS / "CH_antonio.png"
shutil.copyfile(src, VERS / "CH_antonio_pre_rgbfix.png")

cur = Image.open(src).convert("RGBA")
orig = Image.open(VERS / "pre_rembg" / "CH_antonio.png").convert("RGB")
ca = np.array(cur)
oa = np.array(orig)
DX, DY = 44, 60

h, w = ca.shape[:2]
al = ca[..., 3].astype(np.int32)
rgb = ca[..., :3].astype(np.float32)

src_rgb = np.zeros_like(rgb)
sy0, sx0 = DY, DX
src_rgb[:, :] = oa[sy0:sy0 + h, sx0:sx0 + w].astype(np.float32)

opaque = al >= 250
rgb[opaque] = src_rgb[opaque]

toque_zone = np.zeros(al.shape, bool)
toque_zone[0:135, 240:480] = True
semi = (al > 0) & (al < 255) & toque_zone
factor = 255.0 / np.maximum(al[semi], 1)
rgb[semi] = np.clip(rgb[semi] * factor[:, None], 0, 255)

al2 = al.copy()
tz = (al > 0) & (al < 255) & toque_zone
al2[tz & (al >= 24)] = 255

out = np.dstack([rgb.clip(0, 255).astype(np.uint8), al2.astype(np.uint8)])
img = Image.fromarray(out, "RGBA").convert("RGBA")
img.save(src)
print("CH_antonio RGB restored from source; size", img.size)

# previews
comp_dark = Image.new("RGBA", img.size, (20, 20, 24, 255))
comp_dark.alpha_composite(img)
comp_dark.convert("RGB").crop((150, 0, 600, 400)).resize((675, 600), Image.LANCZOS).save(
    r"C:\Users\73B5~1\AppData\Local\Temp\opencode\antonio_dark_head2.png")
comp_lite = Image.new("RGBA", img.size, (245, 245, 245, 255))
comp_lite.alpha_composite(img)
comp_lite.convert("RGB").save(r"C:\Users\73B5~1\AppData\Local\Temp\opencode\antonio_light_full2.png")
print("previews saved")
