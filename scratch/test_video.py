import urllib.request

video_url = "http://127.0.0.1:8000/assets/videos/hero-background.mp4"
try:
    req = urllib.request.Request(video_url, method="HEAD")
    with urllib.request.urlopen(req, timeout=5) as resp:
        print("Status:", resp.getcode())
        print("Content-Type:", resp.headers.get("Content-Type"))
        print("Content-Length:", resp.headers.get("Content-Length"))
except Exception as e:
    print("Video HEAD error:", e)
