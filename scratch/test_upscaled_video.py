import urllib.request

video_urls = [
    "http://127.0.0.1:8000/assets/videos/upscaled-video.mp4",
    "http://127.0.0.1:8000/assets/videos/upscaled_video.mp4",
    "http://127.0.0.1:8000/assets/videos/hero-background.mp4"
]

for url in video_urls:
    try:
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=5) as resp:
            print(f"[OK {resp.getcode()}] {url}")
            print(f"       Type: {resp.headers.get('Content-Type')}, Length: {resp.headers.get('Content-Length')}")
    except Exception as e:
        print(f"[ERR] {url} -> {e}")
