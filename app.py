#!/usr/bin/env python3
"""
FITS Python Application - Production Entry Point
"""

import uvicorn
from pathlib import Path
import os

def main():
    """Start the FastAPI application for production"""
    # Ensure directories exist
    Path("data").mkdir(exist_ok=True)
    Path("uploads").mkdir(exist_ok=True)
    Path("static").mkdir(exist_ok=True)
    
    # Get port from environment (Amplify uses PORT env var)
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    print(f"🚀 Starting FITS Python Application on {host}:{port}")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        log_level="info"
    )

if __name__ == "__main__":
    main()
