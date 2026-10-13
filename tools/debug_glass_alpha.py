import numpy as np
from PIL import Image

p = r"C:\english-quest\assets\OBJ_broken_glass.png"
im = Image.open(p).convert("RGBA")
a = np.array(im)
al = a[..., 3]

alpha_img = Image.fromarray(al, mode="L")
alpha_img.save(r"C:\Users\73B5~1\AppData\Local\Temp\opencode\glass_alpha.png")

for pt in [(0, 0), (5, 5), (30, 30), (100, 100), (384, 20), (20, 384), (384, 384)]:
    y, x = pt
    print(f"({x},{y}) rgb={tuple(a[y, x, :3])} alpha={a[y, x, 3]}")

white_opaque = ((al == 255) & (a[..., 0] > 245) & (a[..., 1] > 245) & (a[..., 2] > 245)).sum()
print("white opaque px:", int(white_opaque))
