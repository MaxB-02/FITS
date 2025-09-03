from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
import os

router = APIRouter(prefix="/api/files", tags=["files"])

@router.get("/{file_path:path}")
async def serve_file(file_path: str):
    """Serve uploaded files"""
    try:
        # Security check - prevent directory traversal
        if ".." in file_path or file_path.startswith("/"):
            raise HTTPException(status_code=400, detail="Invalid file path")
        
        file_full_path = Path(file_path)
        
        # Only serve files from uploads directory
        if not str(file_full_path).startswith("uploads/"):
            raise HTTPException(status_code=400, detail="Invalid file path")
        
        if not file_full_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        return FileResponse(file_full_path)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error serving file: {e}")
        raise HTTPException(status_code=500, detail="Failed to serve file")
