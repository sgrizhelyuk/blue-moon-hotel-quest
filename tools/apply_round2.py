from pathlib import Path
import shutil

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
SRC = ASSETS / "_versions" / "new_sources"
BACKUP2 = ASSETS / "_versions" / "pre_round2"
TEMP = Path(r"C:\Users\73B5~1\AppData\Local\Temp\opencode")

IDS = ["CH_emma", "CH_grant"]

# per-id: drop enclosed comps at least this area, min area to report
RULES = {
    "CH_emma": {"drop": lambda area, x0, x1, y0, y1: area >= 40, "report": 40},
    "CH_grant": {"drop": lambda area, x0, x1, y0, y1: False, "report": 40},
}


def bg_mask(img, iid):
    a = np.array(img.convert("RGB")).astype(np.int16)
    mx = a.max(2)
    mn = a.min(2)
    if iid == "CH_emma":
        cand = (mx - mn <= 16) & (mn >= 140)
    else:  # CH_grant: solid black background
        cand = mx <= 45
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


def process(iid):
    src = SRC / (iid + ".png")
    img = Image.open(src).convert("RGBA")
    print(iid, "src", img.size)
    bg, cand, mx, mn = bg_mask(img, iid)
    removed = bg.copy()

    encl = cand & ~bg
    lab, n = ndimage.label(encl, structure=np.ones((3, 3), int))
    comps = []
    if n:
        sizes = ndimage.sum(encl, lab, range(1, n + 1))
        for i in range(1, n + 1):
            area = int(sizes[i - 1])
            if area < RULES[iid]["report"]:
                continue
            comp = lab == i
            ys, xs = np.where(comp)
            comps.append((area, comp, int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())))
            print("  encl area {0} bbox x {1}-{2} y {3}-{4}".format(
                area, int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())))
    rule = RULES[iid]["drop"]
    if rule is not None:
        for area, comp, x0, x1, y0, y1 in comps:
            if rule(area, x0, x1, y0, y1):
                print("    -> DROP", area)
                removed |= comp

    alpha = np.ones(bg.shape, np.uint8) * 255
    alpha[removed] = 0
    ring = ndimage.binary_dilation(removed, structure=np.ones((5, 5), bool)) & ~removed
    if iid == "CH_emma":
        cond = (mx - mn <= 50) & (mn >= 175)
        w = np.clip((250.0 - mn) / 55.0, 0.0, 1.0)
    else:
        cond = mx <= 100
        w = np.clip((100.0 - mx) / 100.0, 0.0, 1.0)
    fringe = ring & cond
    a = alpha.astype(np.float32)
    a[fringe] = np.minimum(a[fringe], 255.0 * (1.0 - w[fringe]))
    alpha = a.astype(np.uint8)
    print("  fringe px:", int(fringe.sum()), "removed px:", int(removed.sum()))

    out = img.copy()
    out.putalpha(Image.fromarray(alpha))
    bbox = out.getchannel("A").getbbox()
    out = out.crop(bbox)
    print(iid, "trimmed ->", out.size)

    ann = out.copy()
    arr = np.array(ann)
    for area, comp, x0, x1, y0, y1 in comps:
        cc = comp[bbox[1]:bbox[3], bbox[0]:bbox[2]]
        arr[cc, 0] = 255
        arr[cc, 1] = 0
        arr[cc, 2] = 255
        arr[cc, 3] = 255
    ann = Image.fromarray(arr)
    preview(ann, "r2_" + iid + "_ann")
    preview(out, "r2_" + iid + "_grid", grid=True)
    return out


def sc_candidates():
    sc = Image.open(SRC / "SC_final_group.png").convert("RGB")
    print("SC src", sc.size)
    big = sc.resize((1920, 1920), Image.LANCZOS)
    for top_orig in (100, 160, 220):
        top = int(top_orig * 1.875)
        cand_img = big.crop((0, top, 1920, top + 1080))
        name = "sc_cand{0}_top{1}".format((100, 160, 220).index(top_orig) + 1, top_orig)
        cand_img.save(TEMP / (name + ".png"))
        print("saved", name)
    final = big.crop((0, 188, 1920, 188 + 1080))
    cur = ASSETS / "SC_final_group.png"
    dst = BACKUP2 / "SC_final_group.png"
    if cur.exists() and not dst.exists():
        shutil.copy2(cur, dst)
    final.save(cur)
    print("SC_final_group -> saved 1920x1080")


def main():
    BACKUP2.mkdir(parents=True, exist_ok=True)
    for iid in IDS:
        out = process(iid)
        cur = ASSETS / (iid + ".png")
        dst = BACKUP2 / (iid + ".png")
        if cur.exists() and not dst.exists():
            shutil.copy2(cur, dst)
        out.save(cur)
        print(iid, "-> saved", out.size)
    sc_candidates()
    print("done")


if __name__ == "__main__":
    main()
