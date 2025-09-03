from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from ..services.inquiries import inquiries_service
from ..services.templates import templates_service
from ..services.portfolio import portfolio_service
from ..middleware.auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])
templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=HTMLResponse)
async def admin_dashboard(request: Request, user: dict = Depends(require_admin)):
    """Admin dashboard page (equivalent to your app/admin/page.jsx)"""
    try:
        # Fetch data using services
        inquiries = await inquiries_service.get_all()
        templates_list = await templates_service.get_all()
        projects = await portfolio_service.get_all()
        
        # Calculate stats
        stats = await inquiries_service.get_stats()
        
        # Get recent inquiries (last 5)
        recent_inquiries = inquiries[:5]
        
        return templates.TemplateResponse("admin/dashboard.html", {
            "request": request,
            "stats": stats,
            "recent_inquiries": recent_inquiries,
            "templates_count": len(templates_list),
            "projects_count": len(projects)
        })
    except Exception as e:
        print(f"Error loading admin dashboard: {e}")
        return templates.TemplateResponse("admin/dashboard.html", {
            "request": request,
            "stats": {"total": 0, "new": 0, "accepted": 0, "declined": 0},
            "recent_inquiries": [],
            "templates_count": 0,
            "projects_count": 0
        })

@router.get("/inquiries", response_class=HTMLResponse)
async def admin_inquiries(request: Request, user: dict = Depends(require_admin)):
    """Admin inquiries page"""
    try:
        inquiries = await inquiries_service.get_all()
        return templates.TemplateResponse("admin/inquiries.html", {
            "request": request,
            "inquiries": inquiries
        })
    except Exception as e:
        print(f"Error loading admin inquiries: {e}")
        return templates.TemplateResponse("admin/inquiries.html", {
            "request": request,
            "inquiries": []
        })

@router.get("/inquiries/{inquiry_id}", response_class=HTMLResponse)
async def admin_inquiry_detail(request: Request, inquiry_id: str, user: dict = Depends(require_admin)):
    """Admin inquiry detail page"""
    try:
        inquiry = await inquiries_service.get_by_id(inquiry_id)
        if not inquiry:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        
        return templates.TemplateResponse("admin/inquiry-detail.html", {
            "request": request,
            "inquiry": inquiry
        })
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error loading inquiry detail: {e}")
        raise HTTPException(status_code=404, detail="Inquiry not found")

@router.get("/templates", response_class=HTMLResponse)
async def admin_templates(request: Request, user: dict = Depends(require_admin)):
    """Admin templates page"""
    try:
        templates_list = await templates_service.get_all()
        return templates.TemplateResponse("admin/templates.html", {
            "request": request,
            "templates": templates_list
        })
    except Exception as e:
        print(f"Error loading admin templates: {e}")
        return templates.TemplateResponse("admin/templates.html", {
            "request": request,
            "templates": []
        })

@router.get("/templates/{template_id}", response_class=HTMLResponse)
async def admin_template_detail(request: Request, template_id: str, user: dict = Depends(require_admin)):
    """Admin template detail page"""
    try:
        template = await templates_service.get_by_id(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        return templates.TemplateResponse("admin/template-detail.html", {
            "request": request,
            "template": template
        })
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error loading template detail: {e}")
        raise HTTPException(status_code=404, detail="Template not found")

@router.get("/portfolio", response_class=HTMLResponse)
async def admin_portfolio(request: Request, user: dict = Depends(require_admin)):
    """Admin portfolio page"""
    try:
        projects = await portfolio_service.get_all()
        return templates.TemplateResponse("admin/portfolio.html", {
            "request": request,
            "projects": projects
        })
    except Exception as e:
        print(f"Error loading admin portfolio: {e}")
        return templates.TemplateResponse("admin/portfolio.html", {
            "request": request,
            "projects": []
        })

@router.get("/portfolio/{project_id}", response_class=HTMLResponse)
async def admin_portfolio_detail(request: Request, project_id: str, user: dict = Depends(require_admin)):
    """Admin portfolio detail page"""
    try:
        project = await portfolio_service.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return templates.TemplateResponse("admin/portfolio-detail.html", {
            "request": request,
            "project": project
        })
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error loading portfolio detail: {e}")
        raise HTTPException(status_code=404, detail="Project not found")
