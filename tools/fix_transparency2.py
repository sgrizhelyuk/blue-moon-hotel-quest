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


def clean_alpha(img, min_px=300, thresh=10):
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


def soft_threshold(img, lo=160, hi=230, blur=1.2):
    a = np.array(img.getchannel("A")).astype(np.float32)
    a = np.clip((a - lo) * (255.0 / (hi - lo)), 0, 255).astype(np.uint8)
    img.putalpha(Image.fromarray(a).filter(ImageFilter.GaussianBlur(blur)))
    return img


for iid in ["CH_wilkinson", "CH_antonio"]:
    p = ASSETS / (iid + ".png")
    img = Image.open(p).convert("RGBA")
    img = clean_alpha(soft_threshold(img), 400)
    img = trim(img)
    img.save(p)
    print("{0}: -> {1} [threshold]".format(iid, img.size))

iid = "UI_logo_emblem"
img = Image.open(BACKUP / (iid + ".png")).convert("RGBA")
w, h = img.size
cy, cx = h / 2.0, w / 2.0
yy, xx = np.mgrid[0:h, 0:w]
dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
alpha = np.clip((358 - dist) * 42.0, 0, 255).astype(np.uint8)
arr = np.array(img)
arr[:, :, 3] = alpha
img = trim(Image.fromarray(arr))
img.save(ASSETS / (iid + ".png"))
print("{0}: -> {1} [circle mask]".format(iid, img.size))

iid = "CH_watson_owl"
try:
    session = new_session("isnet-anime")
    tag = "isnet-anime"
except Exception as exc:
    session = new_session("birefnet-general")
    tag = "birefnet-general"
img = Image.open(BACKUP / (iid + ".png")).convert("RGBA")
out = remove(img, session=session)
out = clean_alpha(trim(out), 400)
out.save(ASSETS / (iid + ".png"))
print("{0}: -> {1} [{2}]".format(iid, out.size, tag))

print("done")
