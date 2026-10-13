import numpy as np
from pathlib import Path
from PIL import Image
from rembg import new_session, remove
from skimage import measure

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
BACKUP = ASSETS / "_versions" / "pre_rembg"

ISNET_IDS = ["CH_wilkinson", "CH_emma", "CH_antonio", "CH_watson_owl", "UI_logo_emblem"]
ISNET_CROPS = {"UI_dialogue_frame": (5, 480, 495, 768)}


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
    a2 = np.where(keep, a, 0).astype(np.uint8)
    img.putalpha(Image.fromarray(a2))
    return img


def chroma_key(img, lo=12, hi=45):
    arr = np.array(img).astype(np.float32)
    h, w = arr.shape[:2]
    corners = np.stack([arr[2, 2, :3], arr[2, w - 3, :3], arr[h - 3, 2, :3], arr[h - 3, w - 3, :3]])
    bg = np.median(corners, axis=0)
    dist = np.linalg.norm(arr[:, :, :3] - bg, axis=2)
    alpha = np.clip((dist - lo) * (255.0 / (hi - lo)), 0, 255).astype(np.uint8)
    arr[:, :, 3] = np.minimum(arr[:, :, 3], alpha)
    return Image.fromarray(arr.astype(np.uint8))


def save(img, iid, tag):
    out = trim(img)
    out.save(ASSETS / (iid + ".png"))
    print("{0}: {1} -> {2} {3}".format(iid, img.size, out.size, tag))


session = new_session("isnet-general-use")

for iid in ISNET_IDS:
    img = Image.open(BACKUP / (iid + ".png")).convert("RGBA")
    out = remove(img, session=session)
    save(out, iid, "[isnet]")

for iid, box in ISNET_CROPS.items():
    img = Image.open(BACKUP / (iid + ".png")).convert("RGBA").crop(box)
    out = remove(img, session=session)
    save(out, iid, "[isnet+crop]")

iid = "UI_name_plate"
img = Image.open(BACKUP / (iid + ".png")).convert("RGBA")
img = img.crop((0, img.height // 2, img.width, img.height))
save(clean_alpha(chroma_key(img), 500), iid, "[chroma]")

iid = "OBJ_broken_glass"
img = Image.open(BACKUP / (iid + ".png")).convert("RGBA")
save(clean_alpha(chroma_key(img, lo=10, hi=40), 200), iid, "[chroma]")

iid = "OBJ_footprints"
img = Image.open(ASSETS / (iid + ".png")).convert("RGBA")
save(clean_alpha(img, 400), iid, "[clean]")

print("done")
