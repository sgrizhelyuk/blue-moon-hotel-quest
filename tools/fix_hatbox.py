import shutil
from pathlib import Path

from PIL import Image
from rembg import new_session, remove

ASSETS = Path(r"C:\english-quest\assets")
BACKUP = ASSETS / "_versions"

src = BACKUP / "pre_rembg" / "OBJ_hat_box.png"
cur = ASSETS / "OBJ_hat_box.png"
shutil.copyfile(cur, BACKUP / "OBJ_hat_box_u2net.png")

session = new_session("isnet-general-use")
with Image.open(src) as im:
    orig = im.convert("RGBA")
out = remove(orig, session=session, alpha_matting=False)

arr = out
bbox = arr.getchannel("A").getbbox()
if bbox:
    arr = arr.crop(bbox)
arr.save(cur)
print("OBJ_hat_box: isnet retry ->", arr.size)
