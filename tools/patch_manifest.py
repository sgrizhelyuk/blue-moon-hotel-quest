import json
from pathlib import Path

p = Path(r"C:\english-quest\manifest.json")
d = json.loads(p.read_text(encoding="utf-8"))
by = {i["id"]: i for i in d["items"]}

by["UI_choice_button"]["prompt"] = (
    "one single blank pill-shaped button with fully rounded ends, smooth cream-colored "
    "surface, thin golden outline, plain and empty, floating on a plain dark navy background"
)
by["UI_choice_button"]["seed"] = 3131
by["UI_choice_button"]["negative"] = (
    "divided, sections, compartments, strips, bars, windows, inner frames, inner rectangles, "
    "inner lines, panel, multiple objects, two buttons, room, interior, furniture, scene, "
    "letters, words, numbers, digits, text, captions, watermark, signature, logo, "
    "photorealistic, 3d render, harsh shadows, deformed hands, extra fingers, extra limbs"
)

by["UI_feedback_icons"]["prompt"] = (
    "two separate round stickers lying side by side on a plain light gray background, with a "
    "clear gap between them: the left sticker is a green circle with a thick white check mark, "
    "the right sticker is a red circle with a thick white X made of two crossed diagonal lines, "
    "flat cartoon style, both stickers fully visible and complete"
)
by["UI_feedback_icons"]["seed"] = 3132
by["UI_feedback_icons"]["negative"] = (
    "single circle, one badge, merged, combined, half red half green, split circle, pie chart, "
    "plus sign, overlay, banner, ribbon, trophy, medal, ball, arrow, room, interior, scene, "
    "letters, words, numbers, digits, text, captions, watermark, signature, logo, "
    "photorealistic, 3d render, harsh shadows, deformed hands, extra fingers, extra limbs"
)

by["UI_buttons_set"]["prompt"] = (
    "one horizontal row of six round navy blue buttons, evenly spaced, each button has one "
    "simple golden symbol: a house shape, a gear wheel, a loudspeaker, a loudspeaker with a "
    "diagonal slash, a question mark, an arrow pointing left, flat cartoon style, isolated "
    "on a plain light background"
)
by["UI_buttons_set"]["seed"] = 3133
by["UI_buttons_set"]["negative"] = (
    "grid, columns, many buttons, collage, charts, abstract symbols, circles with dots, "
    "room, interior, scene, letters, words, numbers, digits, text, captions, watermark, "
    "signature, copyright, initials, logo, photorealistic, 3d render, harsh shadows, "
    "deformed hands, extra fingers, extra limbs"
)

by["OBJ_testimony"]["prompt"] = (
    "one single comic speech bubble icon, a white rounded bubble with a short tail at the "
    "bottom left, thick golden outline, subtle drop shadow, flat cartoon game icon, isolated "
    "on a plain light background"
)
by["OBJ_testimony"]["seed"] = 3134
by["OBJ_testimony"]["negative"] = (
    "magnifying glass, lens, handle, mirror, grid, set, two bubbles, many bubbles, badge, "
    "room, interior, scene, letters, words, numbers, digits, text, captions, watermark, "
    "signature, logo, photorealistic, 3d render, harsh shadows, deformed hands, extra "
    "fingers, extra limbs"
)

p.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
print("patched: UI_choice_button UI_feedback_icons UI_buttons_set OBJ_testimony")
