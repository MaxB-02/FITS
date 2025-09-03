#!/usr/bin/env python3
"""
FITS Python Application Startup Script
Freak in the Sheets - Custom automation & dashboards
"""

import os
import sys
import uvicorn
from pathlib import Path

def main():
    """Main startup function"""
    print("🚀 Starting FITS Python Application...")
    
    # Ensure we're in the right directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Create necessary directories
    create_directories()
    
    # Load environment variables
    load_environment()
    
    # Start the application
    print("✅ Starting FastAPI server...")
    print("📱 Application will be available at: http://localhost:8000")
    print("📚 API documentation at: http://localhost:8000/docs")
    print("🔧 Admin panel at: http://localhost:8000/admin")
    print("\nPress Ctrl+C to stop the server\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

def create_directories():
    """Create necessary directories if they don't exist"""
    directories = [
        "data",
        "uploads",
        "static",
        "static/css",
        "static/js",
        "app/templates",
        "app/templates/admin",
        "app/templates/auth"
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"📁 Ensured directory exists: {directory}")

def load_environment():
    """Load environment variables from .env file if it exists"""
    env_file = Path(".env")
    if env_file.exists():
        print("🔧 Loading environment variables from .env file")
        from dotenv import load_dotenv
        load_dotenv()
    else:
        print("⚠️  No .env file found, using default values")
        print("💡 Create a .env file with your configuration (see .env.example)")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n👋 Shutting down FITS application...")
        sys.exit(0)
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        sys.exit(1)
