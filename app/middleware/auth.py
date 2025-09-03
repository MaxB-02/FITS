from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
import os

security = HTTPBearer()

# Simple admin credentials (you should use environment variables in production)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"

def verify_token(token: str):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return {"username": username}
    except JWTError:
        return None

async def require_admin(request: Request):
    """Require admin authentication"""
    # Try to get token from Authorization header first
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        user = verify_token(token)
        if user:
            return user
    
    # Try to get token from cookie
    token = request.cookies.get("access_token")
    if token:
        user = verify_token(token)
        if user:
            return user
    
    # No valid token found
    raise HTTPException(status_code=401, detail="Unauthorized")
