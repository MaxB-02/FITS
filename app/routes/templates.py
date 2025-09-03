from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from ..services.templates import templates_service
from ..middleware.auth import require_admin

router = APIRouter(prefix="/api/admin/templates", tags=["admin-templates"])

@router.get("/")
async def get_templates(user: dict = Depends(require_admin)):
    """Get all templates"""
    try:
        templates = await templates_service.get_all()
        return JSONResponse({"templates": templates})
    except Exception as e:
        print(f"Error getting templates: {e}")
        raise HTTPException(status_code=500, detail="Failed to get templates")

@router.get("/{template_id}")
async def get_template(template_id: str, user: dict = Depends(require_admin)):
    """Get template by ID"""
    try:
        template = await templates_service.get_by_id(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return JSONResponse({"template": template})
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting template: {e}")
        raise HTTPException(status_code=500, detail="Failed to get template")

@router.post("/")
async def create_template(
    request: Request,
    user: dict = Depends(require_admin)
):
    """Create new template"""
    try:
        data = await request.json()
        template = await templates_service.create(data)
        return JSONResponse({"template": template})
    except Exception as e:
        print(f"Error creating template: {e}")
        raise HTTPException(status_code=500, detail="Failed to create template")

@router.put("/{template_id}")
async def update_template(
    template_id: str,
    request: Request,
    user: dict = Depends(require_admin)
):
    """Update template"""
    try:
        data = await request.json()
        template = await templates_service.update(template_id, data)
        return JSONResponse({"template": template})
    except Exception as e:
        print(f"Error updating template: {e}")
        raise HTTPException(status_code=500, detail="Failed to update template")

@router.delete("/{template_id}")
async def delete_template(template_id: str, user: dict = Depends(require_admin)):
    """Delete template"""
    try:
        await templates_service.delete(template_id)
        return JSONResponse({"success": True})
    except Exception as e:
        print(f"Error deleting template: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete template")
