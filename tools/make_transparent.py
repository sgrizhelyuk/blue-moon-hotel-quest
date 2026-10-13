from pathlib import Path

from PIL import Image
from rembg import new_session, remove

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
BACKUP = ASSETS / "_versions" / "pre_rembg"

CROPS = {
    "UI_badge_case_closed": (0.0, 0.0, 0.5, 0.5),
    "UI_name_plate": (0.0, 0.5, 1.0, 1.0),
    "UI_dialogue_frame": (5, 480, 495, 768),
    "OBJ_red_coat": (0, 130, 350, 768),
}

IDS = [
    "CH_alex", "CH_antonio", "CH_emma", "CH_grant", "CH_tim", "CH_watson_owl",
    "CH_wilkinson",
    "OBJ_hat_box", "OBJ_receipt", "OBJ_empty_frame", "OBJ_broken_glass",
    "OBJ_footprints", "OBJ_red_thread", "OBJ_red_coat",
    "UI_logo_emblem", "UI_dialogue_frame", "UI_name_plate", "UI_choice_button",
    "UI_owl_hint", "UI_magnifier_cursor", "UI_progress", "UI_translate_button",
    "UI_badge_case_closed",
]


def main():
    session = new_session("u2net")
    BACKUP.mkdir(parents=True, exist_ok=True)
    for iid in IDS:
        src = ASSETS / (iid + ".png")
        img = Image.open(src).convert("RGBA")
        orig = img.copy()
        if iid in CROPS:
            box = CROPS[iid]
            if all(isinstance(v, float) for v in box):
                w, h = img.size
                box = (int(box[0] * w), int(box[1] * h), int(box[2] * w), int(box[3] * h))
            img = img.crop(box)
        out = remove(img, session=session)
        bbox = out.getchannel("A").getbbox()
        if bbox:
            out = out.crop(bbox)
        orig.save(BACKUP / (iid + ".png"))
        out.save(src)
        print("{0}: {1} -> {2}".format(iid, orig.size, out.size))
    print("done:", len(IDS), "items")


if __name__ == "__main__":
    main()
