import numpy as np
from pathlib import Path
from PIL import Image, ImageFilter
from rembg import new_session, remove
from skimage import measure

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
BACKUP = ASSETS / "_versions" / "pre_rembg"


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


session = new_session("isnet-general-use")
iid = "CH_wilkinson"
img = Image.open(BACKUP / (iid + ".png")).convert("RGBA")
out = remove(img, session=session)
out = soft_threshold(out, 200, 245, 1.0)
out = clean_alpha(out, 1500)
out = trim(out)
out.save(ASSETS / (iid + ".png"))
print("{0}: -> {1} [isnet+t200]".format(iid, out.size))
print("done")
