#!/usr/bin/env python3
"""
Connecta image asset downloader.
Run with: python3 download_images.py
Requires internet access. Images are downloaded from their listed Pexels CDN URLs.
Please review each image's current licence and suitability before publishing.
"""
import json
import os
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "images"
OUT.mkdir(exist_ok=True)

with open(HERE / "image_manifest.json", encoding="utf-8") as f:
    assets = json.load(f)

for item in assets:
    destination = OUT / item["filename"]
    if destination.exists() and destination.stat().st_size > 0:
        print(f"SKIP already downloaded: {destination.name}")
        continue
    request = urllib.request.Request(
        item["download_url"],
        headers={"User-Agent": "Mozilla/5.0 ConnectaImagePack/1.0"}
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            data = response.read()
        if not data.startswith(b"\xff\xd8\xff"):
            raise ValueError("The downloaded file does not appear to be a JPEG.")
        destination.write_bytes(data)
        print(f"OK {destination.name} ({len(data):,} bytes)")
    except Exception as exc:
        print(f"FAILED {destination.name}: {exc}")
        print(f"  Open source page manually: {item['source']}")

print(f"\nFinished. Check the images folder: {OUT}")
