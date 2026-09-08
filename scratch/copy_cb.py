import pathlib

base_dir = pathlib.Path(__file__).resolve().parent.parent
cb_file = base_dir / "CodeBreakerz.html"
target_file = base_dir / "html" / "CodeBreakerz.html"

content = cb_file.read_text(encoding="utf-8")
content = content.replace("assets/images/", "../assets/images/")
content = content.replace('href="/"', 'href="index.html"')

target_file.write_text(content, encoding="utf-8")
print(f"Wrote {target_file}, size: {target_file.stat().st_size} bytes")
