from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
BACKUP = ASSETS / "_versions" / "pre_rembg"
TEMP = Path(r"C:\Users\73B5~1\AppData\Local\Temp\opencode")

IDS = ["CH_tim", "CH_grant", "CH_wilkinson"]


def preview(alpha_img, name, tag):
    rgb = alpha_img.convert("RGB")
    comp = Image.new("RGBA", rgb.size, (25, 25, 30, 255))
    comp.alpha_composite(alpha_img)
    h = 640
    comp = comp.resize((int(rgb.width * h / rgb.height), h), Image.LANCZOS)
    comp.convert("RGB").save(TEMP / "{0}_reseg_{1}.png".format(name, tag))


def main():
    session = new_session("isnet-general-use")
    for iid in IDS:
        src = BACKUP / (iid + ".png")
        img = Image.open(src).convert("RGBA")
        out = remove(img, session=session)
        alpha = np.array(out.getchannel("A"))
        print("{0}: src {1}, alpha>16 px {2}, bbox {3}".format(
            iid, img.size, int((alpha > 16).sum()), out.getchannel("A").getbbox()))
        preview(out, iid, "isnet")
    print("done")


if __name__ == "__main__":
    main()
