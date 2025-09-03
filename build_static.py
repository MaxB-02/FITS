#!/usr/bin/env python3
"""
Build script to create static files for deployment
"""

import os
import shutil
from pathlib import Path

def build_static():
    """Build static files for deployment"""
    print("🔨 Building static files for deployment...")
    
    # Create build directory
    build_dir = Path("build")
    if build_dir.exists():
        shutil.rmtree(build_dir)
    build_dir.mkdir()
    
    # Copy static files
    static_dir = Path("static")
    if static_dir.exists():
        shutil.copytree(static_dir, build_dir / "static")
        print("✅ Copied static files")
    
    # Copy templates
    templates_dir = Path("app/templates")
    if templates_dir.exists():
        shutil.copytree(templates_dir, build_dir / "templates")
        print("✅ Copied templates")
    
    # Copy data directory
    data_dir = Path("data")
    if data_dir.exists():
        shutil.copytree(data_dir, build_dir / "data")
        print("✅ Copied data directory")
    
    # Create index.html redirect
    index_html = build_dir / "index.html"
    with open(index_html, "w") as f:
        f.write("""
<!DOCTYPE html>
<html>
<head>
    <title>FITS - Freak in the Sheets</title>
    <meta http-equiv="refresh" content="0; url=https://your-app-url.herokuapp.com">
</head>
<body>
    <p>Redirecting to FITS application...</p>
    <p>If you are not redirected automatically, <a href="https://your-app-url.herokuapp.com">click here</a>.</p>
</body>
</html>
        """)
    
    print("✅ Created index.html redirect")
    print(f"🎉 Build complete! Files in: {build_dir}")

if __name__ == "__main__":
    build_static()
