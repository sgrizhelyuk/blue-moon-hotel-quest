import numpy as np
from pathlib import Path
from PIL import Image
from skimage import measure

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
BACKUP = ASSETS / "_versions" / "pre_rembg"


def clean_alpha(img, min_px, thresh=10):
    a = np.array(img.getchannel("A"))
    labels = measure.label(a > thresh)
    if labels.max() == 0:
        return img
    counts = np.bincount(labels.ravel())
    keep = np.zeros_like(a, dtype=bool)
    for i in range(1, len(counts)):
        if counts[i] >= min_px:
            keep |= labels == i
    img.putalpha(Image.fromarray(np.where(keep, a, 0).astype(np.uint8)))
    return img


iid = "OBJ_broken_glass"
img = Image.open(BACKUP / (iid + ".png")).convert("RGBA")
arr = np.array(img)
rgb = arr[:, :, :3].astype(np.int32)
q = rgb // 16
key = q[:, :, 0] * 10000 + q[:, :, 1] * 100 + q[:, :, 2]
vals, counts = np.unique(key.ravel(), return_counts=True)
bg_key = vals[int(np.argmax(counts))]
bg = rgb[key == bg_key].mean(axis=0)
print("dominant bg:", bg.round(0), "share:", (counts.max() / key.size).round(3))
dist = np.linalg.norm(rgb - bg, axis=2).astype(np.float32)
arr[:, :, 3] = np.clip((dist - 10) * (255.0 / 30.0), 0, 255).astype(np.uint8)
out = clean_alpha(Image.fromarray(arr), 200)
out.save(ASSETS / (iid + ".png"))
print("{0}: -> {1} [chroma-v2]".format(iid, out.size))
print("done")
