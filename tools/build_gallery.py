import json
from pathlib import Path

ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
OUT = ASSETS / "gallery.html"

FALLBACK = {
    "UI_feedback_icons": "3 попытки не удались. Рисуем в коде: зелёная галочка + красный крест (SVG).",
    "UI_buttons_set": "3 попытки не удались. Рисуем в коде (SVG): дом, шестерня, динамик, динамик-off, «?», стрелка назад.",
    "OBJ_testimony": "3 попытки не удались (последняя — текст в картинке). Рисуем в коде: речевой пузырь (SVG).",
}

NOTES = {
    "CH_antonio": "Шляпа красная вместо белой; фон вырежем (rembg).",
    "CH_tim": "Выглядит чуть старше 16 — принято. Аниме-версия в _versions.",
    "UI_case_map": "Нет красных нитей-пинов (незначительно).",
    "UI_badge_case_closed": "Лист 2×2 — кропнуть один бейдж.",
    "UI_dialogue_frame": "Лист панелей — кропнуть нужную.",
    "UI_name_plate": "Два варианта — кропнуть один.",
    "UI_choice_button": "Тёмно-синяя капсула — текст выбора белым сверху.",
    "UI_magnifier_cursor": "Идеальная лупа.",
    "UI_translate_button": "Глобус — ок.",
    "OBJ_empty_frame": "Мелкие артефакты-«скобки» внутри (незначительно).",
    "OBJ_red_coat": "Кропнуть до красного пальто (белые — фон-контекст).",
    "OBJ_footprints": "Стилизованные подошвы на мокрой плитке — ок.",
    "OBJ_painting": "«Луна над Темзой» — отличная.",
}

GROUPS = [
    ("background", "Фоны"),
    ("character", "Персонажи"),
    ("ui", "UI-элементы"),
    ("object", "Объекты-улики"),
    ("scene", "Финальная сцена"),
]

CSS = """
body { background:#141b2c; color:#f3e9d2; font-family:'Segoe UI',sans-serif; margin:24px; }
h1 { color:#d9a441; }
h2 { color:#d9a441; border-bottom:2px solid #1b2a4a; padding-bottom:6px; margin-top:36px; }
.count { color:#8fa3c8; font-size:16px; font-weight:normal; }
.grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:16px; }
.card { background:#1b2a4a; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px #0008; }
.card img { width:100%; display:block; background:#0c1220; }
.cap { padding:8px 12px 4px; font-weight:600; color:#f3e9d2; }
.note { padding:0 12px 10px; font-size:13px; color:#8fa3c8; }
.fallback { border:2px dashed #a63a3a; }
.fallback .cap { color:#e08585; }
.fallback .big { padding:40px 12px; text-align:center; color:#e08585; font-size:14px; }
.legend { color:#8fa3c8; font-size:14px; }
"""


def main():
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    items = manifest["items"]
    accepted = sum(1 for i in items if i["id"] not in FALLBACK)

    parts = [
        "<!DOCTYPE html><html lang='ru'><head><meta charset='utf-8'>",
        "<title>Ассеты: Лунный вечер</title><style>%s</style></head><body>" % CSS,
        "<h1>Тайна отеля «Лунный вечер» — галерея ассетов</h1>",
        "<p class='legend'>Принято: %d из %d. Пунктирная рамка — рисуем кодом (SVG).</p>"
        % (accepted, len(items)),
    ]

    for gtype, title in GROUPS:
        group = [i for i in items if i["type"] == gtype]
        fb = sum(1 for i in group if i["id"] in FALLBACK)
        tail = " (+%d кодом)" % fb if fb else ""
        parts.append("<h2>%s <span class='count'>%d%s</span></h2>" % (title, len(group), tail))
        parts.append("<div class='grid'>")
        for it in group:
            iid = it["id"]
            note = NOTES.get(iid, "")
            if iid in FALLBACK:
                parts.append(
                    "<div class='card fallback'><div class='cap'>%s</div>"
                    "<div class='big'>Код-фолбэк</div><div class='note'>%s</div></div>"
                    % (iid, FALLBACK[iid])
                )
                continue
            img = ASSETS / (iid + ".png")
            if not img.exists():
                parts.append(
                    "<div class='card fallback'><div class='cap'>%s</div>"
                    "<div class='big'>ФАЙЛ ОТСУТСТВУЕТ</div></div>" % iid
                )
                continue
            parts.append(
                "<div class='card'><img src='%s.png' loading='lazy' alt='%s'>"
                "<div class='cap'>%s <span class='count'>seed %s</span></div>"
                "<div class='note'>%s</div></div>" % (iid, iid, iid, it.get("seed", "?"), note)
            )
        parts.append("</div>")

    parts.append("</body></html>")
    OUT.write_text("\n".join(parts), encoding="utf-8")
    print("gallery written: %s (accepted %d/%d)" % (OUT, accepted, len(items)))


if __name__ == "__main__":
    main()
