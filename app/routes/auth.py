from fastapi import APIRouter, Request, Depends, HTTPException, Form
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import secrets

router = APIRouter(tags=["auth"])
templates = Jinja2Templates(directory="app/templates")

# Simple admin credentials (you should use environment variables in production)
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict):
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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

@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    """Login page"""
    return templates.TemplateResponse("auth/login.html", {"request": request})

@router.post("/login")
async def login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...)
):
    """Login endpoint"""
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        access_token = create_access_token(data={"sub": username})
        
        # Check if this is an AJAX request
        accept_header = request.headers.get('accept', '')
        is_ajax = 'application/json' in accept_header
        
        if is_ajax:
            return JSONResponse({
                "access_token": access_token,
                "token_type": "bearer"
            })
        else:
            response = RedirectResponse(url="/admin", status_code=303)
            response.set_cookie(key="access_token", value=access_token, httponly=True)
            return response
    else:
        if 'application/json' in request.headers.get('accept', ''):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        else:
            response = RedirectResponse(url="/login?error=InvalidCredentials", status_code=303)
            return response

@router.post("/logout")
async def logout():
    """Logout endpoint"""
    response = RedirectResponse(url="/login", status_code=303)
    response.delete_cookie(key="access_token")
    return response

@router.get("/logout")
async def logout_get():
    """Logout GET endpoint"""
    response = RedirectResponse(url="/login", status_code=303)
    response.delete_cookie(key="access_token")
    return response
