#!/usr/bin/env python3
"""
FITS Python Application - Simple Startup
"""

import uvicorn
from pathlib import Path

def main():
    """Start the FastAPI application"""
    print("🚀 Starting FITS Python Application...")
    print("📱 Application will be available at: http://localhost:8000")
    print("🔧 Admin panel at: http://localhost:8000/admin")
    print("📚 API documentation at: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server\n")
    
    # Ensure directories exist
    Path("data").mkdir(exist_ok=True)
    Path("uploads").mkdir(exist_ok=True)
    Path("static").mkdir(exist_ok=True)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
