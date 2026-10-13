from pathlib import Path
import shutil

import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy import ndimage

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
PRE_REMBG = ASSETS / "_versions" / "pre_rembg"
PRE_REFIT = ASSETS / "_versions" / "pre_refit"
TEMP = Path(r"C:\Users\73B5~1\AppData\Local\Temp\opencode")


def clean_alpha(img, thr=16):
    a = np.array(img.getchannel("A"))
    a[a < thr] = 0
    out = img.copy()
    out.putalpha(Image.fromarray(a))
    return out


def trim(img):
    bbox = img.getchannel("A").getbbox()
    return img.crop(bbox) if bbox else img


def keep_wilkinson_components(img):
    a = np.array(img.getchannel("A")) > 16
    lab, n = ndimage.label(a)
    if n == 0:
        return img
    sizes = ndimage.sum(a, lab, range(1, n + 1))
    main_idx = int(np.argmax(sizes)) + 1
    main = lab == main_idx
    ys, xs = np.where(main)
    main_cx = (xs.min() + xs.max()) / 2.0
    main_w = xs.max() - xs.min()
    keep = main.copy()
    for i in range(1, n + 1):
        if i == main_idx:
            continue
        comp = lab == i
        cy, cx = np.where(comp)
        area = int(sizes[i - 1])
        big_bottom = area > 2000 and cy.max() > 700
        small_center = 100 <= area <= 5000 and cy.min() > 350 and abs((cx.min() + cx.max()) / 2.0 - main_cx) < 0.4 * main_w
        if big_bottom or small_center:
            keep |= comp
        else:
            print("  drop comp area {0} bbox x {1}-{2} y {3}-{4}".format(
                area, cx.min(), cx.max(), cy.min(), cy.max()))
    out = img.copy()
    arr = np.array(out.getchannel("A"))
    arr[~keep] = 0
    out.putalpha(Image.fromarray(arr))
    return out


def clean_wilkinson_halo(img, y_limit=860, near=12):
    a = np.array(img.getchannel("A"))
    rgb = np.array(img.convert("RGB")).astype(np.int16)
    solid = a >= 245
    dist = ndimage.distance_transform_edt(~solid)
    warm = (rgb[:, :, 0] - rgb[:, :, 2] > 28) & (rgb[:, :, 0] > 170) & (rgb[:, :, 2] < 200)
    rows = np.arange(a.shape[0])[:, None] * np.ones((1, a.shape[1]), dtype=int)
    zone = rows < y_limit
    kill = zone & (dist > near) & ((a < 245) | warm)
    print("  halo kill px:", int(kill.sum()))
    a[kill] = 0
    out = img.copy()
    out.putalpha(Image.fromarray(a))
    return out


def preview(img, name):
    comp = Image.new("RGBA", img.size, (25, 25, 30, 255))
    comp.alpha_composite(img)
    h = 640
    comp = comp.resize((int(img.width * h / img.height), h), Image.LANCZOS)
    comp.convert("RGB").save(TEMP / "{0}_refit.png".format(name))


def main():
    session = new_session("isnet-general-use")
    PRE_REFIT.mkdir(parents=True, exist_ok=True)
    for iid in ["CH_tim", "CH_grant", "CH_wilkinson"]:
        src = Image.open(PRE_REMBG / (iid + ".png")).convert("RGBA")
        out = remove(src, session=session)
        print(iid, "raw bbox", out.getchannel("A").getbbox())
        if iid == "CH_wilkinson":
            out = keep_wilkinson_components(out)
            out = clean_wilkinson_halo(out)
        out = clean_alpha(out, 16)
        out = trim(out)
        cur = ASSETS / (iid + ".png")
        dst = PRE_REFIT / (iid + ".png")
        if cur.exists() and not dst.exists():
            shutil.copy2(cur, dst)
        out.save(cur)
        preview(out, iid)
        print(iid, "->", out.size)
    print("done")


if __name__ == "__main__":
    main()
