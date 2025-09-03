from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

# Import routes
from .routes import admin, inquiries, templates as templates_router, portfolio, auth, files, admin_inquiries

# Create FastAPI app
app = FastAPI(
    title="FITS - Freak in the Sheets",
    description="Custom automation & dashboards tailored to your workflow.",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="app/templates")

# Include routers
app.include_router(auth.router)
app.include_router(inquiries.router)
app.include_router(admin.router)
app.include_router(admin_inquiries.router)
app.include_router(templates_router.router)
app.include_router(portfolio.router)
app.include_router(files.router)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """Home page"""
    return templates.TemplateResponse("home.html", {"request": request})

@app.get("/inquire", response_class=HTMLResponse)
async def inquire_page(request: Request, template: str = None):
    """Inquiry form page"""
    return templates.TemplateResponse("inquire.html", {
        "request": request,
        "template_id": template
    })

@app.get("/thank-you", response_class=HTMLResponse)
async def thank_you(request: Request):
    """Thank you page"""
    return templates.TemplateResponse("thank-you.html", {"request": request})

@app.get("/portfolio", response_class=HTMLResponse)
async def portfolio_page(request: Request):
    """Portfolio page"""
    from .services.portfolio import portfolio_service
    try:
        projects = await portfolio_service.get_all()
    except Exception as e:
        print(f"Error loading portfolio: {e}")
        projects = []
    
    return templates.TemplateResponse("portfolio.html", {
        "request": request,
        "projects": projects
    })

@app.get("/portfolio/{project_id}", response_class=HTMLResponse)
async def portfolio_detail(request: Request, project_id: str):
    """Portfolio detail page"""
    from .services.portfolio import portfolio_service
    try:
        project = await portfolio_service.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
    except Exception as e:
        print(f"Error loading project: {e}")
        raise HTTPException(status_code=404, detail="Project not found")
    
    return templates.TemplateResponse("portfolio-detail.html", {
        "request": request,
        "project": project
    })

@app.get("/templates", response_class=HTMLResponse)
async def templates_page(request: Request):
    """Templates page"""
    from .services.templates import templates_service
    try:
        template_list = await templates_service.get_all()
    except Exception as e:
        print(f"Error loading templates: {e}")
        template_list = []
    
    return templates.TemplateResponse("templates.html", {
        "request": request,
        "templates": template_list
    })

@app.get("/templates/{template_id}", response_class=HTMLResponse)
async def template_detail(request: Request, template_id: str):
    """Template detail page"""
    from .services.templates import templates_service
    try:
        template = await templates_service.get_by_id(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
    except Exception as e:
        print(f"Error loading template: {e}")
        raise HTTPException(status_code=404, detail="Template not found")
    
    return templates.TemplateResponse("template-detail.html", {
        "request": request,
        "template": template
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)