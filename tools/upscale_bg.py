import json
import shutil
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

SERVER = "http://127.0.0.1:8188"
ROOT = Path(r"C:\english-quest")
ASSETS = ROOT / "assets"
BACKUP = ASSETS / "_versions" / "pre_upscale"
COMFY = Path(r"C:\english-quest\tools\ComfyUI_windows_portable\ComfyUI")
INPUT = COMFY / "input"

BGS = [
    "BG_taxi", "BG_hotel_exterior", "BG_reception", "BG_lobby_crime",
    "BG_frame_closeup", "BG_prologue", "BG_office", "BG_restaurant",
    "BG_kitchen", "BG_corridor", "BG_luggage_room", "BG_garden",
    "BG_lobby_happy", "BG_epilogue",
]


def post(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(SERVER + path, data=data,
                                 headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def get_json(path):
    return json.load(urllib.request.urlopen(SERVER + path, timeout=60))


def get_bytes(path):
    return urllib.request.urlopen(SERVER + path, timeout=300).read()


def workflow(fname, prefix):
    return {
        "1": {"class_type": "LoadImage", "inputs": {"image": fname}},
        "2": {"class_type": "UpscaleModelLoader",
              "inputs": {"model_name": "RealESRGAN_x4plus.pth"}},
        "3": {"class_type": "ImageUpscaleWithModel",
              "inputs": {"upscale_model": ["2", 0], "image": ["1", 0]}},
        "4": {"class_type": "ImageScale",
              "inputs": {"image": ["3", 0], "upscale_method": "lanczos",
                         "width": 1920, "height": 1080, "crop": "disabled"}},
        "5": {"class_type": "SaveImage",
              "inputs": {"filename_prefix": prefix, "images": ["4", 0]}},
    }


def main():
    BACKUP.mkdir(parents=True, exist_ok=True)
    for iid in BGS:
        src = ASSETS / (iid + ".png")
        with Image.open(src) as im:
            orig_size = im.size
        fname = "up_" + iid + ".png"
        shutil.copyfile(src, INPUT / fname)
        t0 = time.time()
        resp = post("/prompt", {"prompt": workflow(fname, "quest_up/" + iid)})
        pid = resp["prompt_id"]
        while True:
            history = get_json("/history/" + pid)
            if pid in history:
                break
            if time.time() - t0 > 1800:
                raise TimeoutError("timeout for " + iid)
            time.sleep(2)
        entry = history[pid]
        if entry.get("status", {}).get("status_str") == "error":
            raise RuntimeError("ComfyUI error for " + iid)
        img = entry["outputs"]["5"]["images"][0]
        query = urllib.parse.urlencode({"filename": img["filename"],
                                        "subfolder": img.get("subfolder", ""),
                                        "type": img.get("type", "output")})
        data = get_bytes("/view?" + query)
        tmp = BACKUP / (iid + "_up_tmp.png")
        tmp.write_bytes(data)
        with Image.open(tmp) as chk:
            new_size = chk.size
        shutil.copyfile(src, BACKUP / (iid + ".png"))
        tmp.replace(src)
        print("{0}: {1} -> {2} ({3:.1f}s)".format(iid, orig_size, new_size, time.time() - t0))
    print("done:", len(BGS), "backgrounds")


if __name__ == "__main__":
    main()
