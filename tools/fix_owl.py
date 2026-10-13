import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter
from skimage import measure

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"


def trim(img):
    bbox = img.getchannel("A").getbbox()
    return img.crop(bbox) if bbox else img


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


def soft_threshold(img, lo, hi, blur=1.0):
    a = np.array(img.getchannel("A")).astype(np.float32)
    a = np.clip((a - lo) * (255.0 / (hi - lo)), 0, 255).astype(np.uint8)
    img.putalpha(Image.fromarray(a).filter(ImageFilter.GaussianBlur(blur)))
    return img


iid = "UI_owl_hint"
p = ASSETS / (iid + ".png")
img = Image.open(p).convert("RGBA")
img = soft_threshold(img, 140, 220, 1.2)
img = clean_alpha(img, 2500)
img = trim(img)
img.save(p)
print("{0}: -> {1} [threshold+clean]".format(iid, img.size))
print("done")
