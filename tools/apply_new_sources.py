from pathlib import Path
import shutil

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
SRC = ASSETS / "_versions" / "new_sources"
PRE_NEW = ASSETS / "_versions" / "pre_new"
TEMP = Path(r"C:\Users\73B5~1\AppData\Local\Temp\opencode")

IDS = ["CH_tim", "CH_grant", "CH_wilkinson", "CH_antonio", "CH_alex"]


def bg_mask(img, iid):
    a = np.array(img.convert("RGB")).astype(np.int16)
    mx = a.max(2)
    mn = a.min(2)
    if iid == "CH_alex":
        cand = (mx - mn <= 16) & (mn >= 140)
    else:
        cand = (mn >= 230) & (mx - mn <= 22)
    seed = np.zeros(cand.shape, bool)
    seed[0, :] = seed[-1, :] = True
    seed[:, 0] = seed[:, -1] = True
    seed &= cand
    bg = ndimage.binary_propagation(seed, structure=np.ones((3, 3), bool), mask=cand)
    return bg, cand, mx, mn


def preview(img, name, grid=False):
    h = 720
    scaled = img.resize((max(1, int(img.width * h / img.height)), h), Image.LANCZOS)
    comp = Image.new("RGBA", scaled.size, (32, 34, 40, 255))
    comp.alpha_composite(scaled)
    comp = comp.convert("RGB")
    if grid:
        d = ImageDraw.Draw(comp)
        for pct in range(5, 100, 5):
            y = int(comp.height * pct / 100)
            d.line([(0, y), (comp.width, y)], fill=(255, 0, 0, 255) if pct % 10 == 0 else (120, 60, 60), width=1)
            if pct % 10 == 0:
                d.text((4, y + 2), str(pct), fill=(255, 255, 0))
    comp.save(TEMP / "{0}.png".format(name))


def table_top_row(img):
    a = np.array(img.convert("RGB")).astype(np.int16)
    red = (a[:, :, 0] > 170) & (a[:, :, 1] < 120) & (a[:, :, 2] < 120)
    frac = red.mean(axis=1)
    rows = np.where(frac >= 0.6)[0]
    rows = rows[rows >= 600]
    return int(rows.min()) if len(rows) else None


def main():
    PRE_NEW.mkdir(parents=True, exist_ok=True)
    for iid in IDS:
        src = SRC / (iid + ".jpg")
        img = Image.open(src).convert("RGBA")
        print(iid, "src", img.size)
        bg, cand, mx, mn = bg_mask(img, iid)
        removed = bg.copy()

        encl = cand & ~bg
        lab, n = ndimage.label(encl, structure=np.ones((3, 3), int))
        if n:
            sizes = ndimage.sum(encl, lab, range(1, n + 1))
            for i in range(1, n + 1):
                area = int(sizes[i - 1])
                if area < 40:
                    continue
                comp = lab == i
                ys, xs = np.where(comp)
                y0, y1 = int(ys.min()), int(ys.max())
                if iid == "CH_tim":
                    drop = area >= 40
                elif iid in ("CH_grant", "CH_wilkinson"):
                    drop = area >= 150
                elif iid == "CH_antonio":
                    drop = area >= 100 and y0 > 500
                else:
                    drop = False
                if area >= 150 or drop:
                    print("  encl area {0} bbox x {1}-{2} y {3}-{4} -> {5}".format(
                        area, int(xs.min()), int(xs.max()), y0, y1, "DROP" if drop else "keep"))
                if drop:
                    removed |= comp

        alpha = np.ones(bg.shape, np.uint8) * 255
        alpha[removed] = 0

        ring = ndimage.binary_dilation(removed, structure=np.ones((5, 5), bool)) & ~removed
        cond = (mx - mn <= 50) & (mn >= 175)
        w = np.clip((250.0 - mn) / 55.0, 0.0, 1.0)
        fringe = ring & cond
        a = alpha.astype(np.float32)
        a[fringe] = np.minimum(a[fringe], 255.0 * (1.0 - w[fringe]))
        alpha = a.astype(np.uint8)
        print("  fringe px:", int(fringe.sum()))

        out = img.copy()
        out.putalpha(Image.fromarray(alpha))

        if iid == "CH_antonio":
            tt = table_top_row(img)
            cut = (tt or 1172) - 12
            print("  table top row:", tt, "-> cut at", cut)
            out = out.crop((0, 0, out.width, cut))

        bbox = out.getchannel("A").getbbox()
        out = out.crop(bbox)
        cur = ASSETS / (iid + ".png")
        dst = PRE_NEW / (iid + ".png")
        if cur.exists() and not dst.exists():
            shutil.copy2(cur, dst)
        out.save(cur)
        preview(out, "new_" + iid)
        preview(out, "new_" + iid + "_grid", grid=True)
        print(iid, "->", out.size)
    print("done")


if __name__ == "__main__":
    main()
