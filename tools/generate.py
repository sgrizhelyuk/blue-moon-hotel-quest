import argparse
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

SERVER = "http://127.0.0.1:8188"
ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "manifest.json"
ASSETS = ROOT / "assets"

MODELS = {
    "turbo": {"ckpt": "sd_xl_turbo_1.0_fp16.safetensors", "steps": 6, "cfg": 1.0,
              "sampler": "euler_ancestral", "scheduler": "normal"},
    "base": {"ckpt": "sd_xl_base_1.0.safetensors", "steps": 28, "cfg": 7.0,
             "sampler": "dpmpp_2m", "scheduler": "karras"},
}


def post(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(SERVER + path, data=data,
                                 headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=60))


def get_json(path):
    return json.load(urllib.request.urlopen(SERVER + path, timeout=60))


def get_bytes(path):
    return urllib.request.urlopen(SERVER + path, timeout=300).read()


def build_workflow(item, model_key, style, negative):
    m = MODELS[model_key]
    prompt = "{}, {}".format(item["prompt"], item.get("style", style))
    neg = item.get("negative", negative)
    return {
        "4": {"class_type": "CheckpointLoaderSimple",
              "inputs": {"ckpt_name": m["ckpt"]}},
        "5": {"class_type": "EmptyLatentImage",
              "inputs": {"width": item["width"], "height": item["height"], "batch_size": 1}},
        "6": {"class_type": "CLIPTextEncode",
              "inputs": {"text": prompt, "clip": ["4", 1]}},
        "7": {"class_type": "CLIPTextEncode",
              "inputs": {"text": neg, "clip": ["4", 1]}},
        "3": {"class_type": "KSampler",
              "inputs": {"seed": item.get("seed", 42), "steps": m["steps"], "cfg": m["cfg"],
                         "sampler_name": m["sampler"], "scheduler": m["scheduler"],
                         "denoise": 1.0, "model": ["4", 0], "positive": ["6", 0],
                         "negative": ["7", 0], "latent_image": ["5", 0]}},
        "8": {"class_type": "VAEDecode", "inputs": {"samples": ["3", 0], "vae": ["4", 2]}},
        "9": {"class_type": "SaveImage",
              "inputs": {"filename_prefix": "quest/{}".format(item["id"]), "images": ["8", 0]}},
    }


def generate(item, model_key, style, negative):
    wf = build_workflow(item, model_key, style, negative)
    resp = post("/prompt", {"prompt": wf})
    pid = resp["prompt_id"]
    print("[{}] queued {}, model={}, {}x{}".format(
        item["id"], pid, model_key, item["width"], item["height"]))
    t0 = time.time()
    while True:
        history = get_json("/history/" + pid)
        if pid in history:
            break
        if time.time() - t0 > 1800:
            raise TimeoutError("generation timeout for " + item["id"])
        time.sleep(2)
    entry = history[pid]
    status = entry.get("status", {})
    if status.get("status_str") == "error":
        raise RuntimeError("ComfyUI error: " + json.dumps(status))
    img = entry["outputs"]["9"]["images"][0]
    query = urllib.parse.urlencode({"filename": img["filename"],
                                    "subfolder": img.get("subfolder", ""),
                                    "type": img.get("type", "output")})
    data = get_bytes("/view?" + query)
    out = ASSETS / (item["id"] + ".png")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(data)
    print("[{}] saved {} ({} KB, {:.1f}s)".format(
        item["id"], out, len(data) // 1024, time.time() - t0))
    return {"file": str(out), "prompt_id": pid, "seed": item.get("seed", 42)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--id", action="append", default=[], help="generate only these ids")
    ap.add_argument("--pilot", action="store_true", help="generate only pilot items")
    ap.add_argument("--model", choices=["turbo", "base"], default=None, help="override model")
    ap.add_argument("--force", action="store_true", help="regenerate even if file exists")
    args = ap.parse_args()

    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    style, negative = manifest["style"], manifest["negative"]
    items = manifest["items"]
    if args.id:
        items = [i for i in items if i["id"] in args.id]
        if not items:
            sys.exit("no items matched --id")
    elif args.pilot:
        items = [i for i in items if i.get("pilot")]

    meta_path = ASSETS / "metadata.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8")) if meta_path.exists() else {}

    for item in items:
        model_key = args.model or item.get("model") or "turbo"
        out = ASSETS / (item["id"] + ".png")
        if out.exists() and not args.force:
            print("[{}] exists, skip (use --force)".format(item["id"]))
            continue
        info = generate(item, model_key, style, negative)
        meta[item["id"]] = {"prompt": item["prompt"], "model": model_key, **info}
        meta_path.parent.mkdir(parents=True, exist_ok=True)
        meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
