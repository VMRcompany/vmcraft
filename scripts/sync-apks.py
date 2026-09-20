import json
import os
import subprocess
import sys

REPO = "VMRcompany/vmcraft-updates"
OUT_DIR = os.path.join("dist", "apk")
os.makedirs(OUT_DIR, exist_ok=True)


def gh_json(args):
    raw = subprocess.check_output(["gh", *args], text=True)
    return json.loads(raw)


def main():
    releases = gh_json(["api", f"repos/{REPO}/releases?per_page=100"])
    manifest = {"latest": None, "releases": []}

    for rel in releases:
        if rel.get("draft"):
            continue
        tag = rel.get("tag_name") or ""
        assets = [a for a in rel.get("assets") or [] if str(a.get("name", "")).lower().endswith(".apk")]
        if not tag or not assets:
            continue
        asset = assets[0]
        dest_name = asset["name"]
        dest = os.path.join(OUT_DIR, dest_name)
        if not os.path.isfile(dest):
            subprocess.check_call([
                "gh", "release", "download", tag,
                "-R", REPO,
                "-p", "*.apk",
                "-D", OUT_DIR,
            ])
        if not os.path.isfile(dest):
            found = [f for f in os.listdir(OUT_DIR) if f.lower().endswith(".apk") and tag in f]
            if found:
                dest_name = found[0]
                dest = os.path.join(OUT_DIR, dest_name)
        size = os.path.getsize(dest) if os.path.isfile(dest) else asset.get("size") or 0
        item = {
            "version": tag,
            "name": rel.get("name") or f"VMcraft {tag}",
            "published": rel.get("published_at"),
            "size": size,
            "file": dest_name,
            "path": f"apk/{dest_name}",
            "body": (rel.get("body") or "").strip(),
            "prerelease": bool(rel.get("prerelease")),
        }
        manifest["releases"].append(item)
        if manifest["latest"] is None and not item["prerelease"] and os.path.isfile(dest):
            manifest["latest"] = tag

    if not manifest["releases"]:
        raise SystemExit("no APK releases found")
    with open(os.path.join(OUT_DIR, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=2)
    print("synced", len(manifest["releases"]), "releases; latest=", manifest["latest"], file=sys.stderr)


if __name__ == "__main__":
    main()
