from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from ..services.portfolio import portfolio_service
from ..middleware.auth import require_admin

router = APIRouter(prefix="/api/admin/portfolio", tags=["admin-portfolio"])

@router.get("/")
async def get_portfolio(user: dict = Depends(require_admin)):
    """Get all portfolio projects"""
    try:
        projects = await portfolio_service.get_all()
        return JSONResponse({"projects": projects})
    except Exception as e:
        print(f"Error getting portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to get portfolio")

@router.get("/{project_id}")
async def get_project(project_id: str, user: dict = Depends(require_admin)):
    """Get portfolio project by ID"""
    try:
        project = await portfolio_service.get_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return JSONResponse({"project": project})
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting project: {e}")
        raise HTTPException(status_code=500, detail="Failed to get project")

@router.post("/")
async def create_project(
    request: Request,
    user: dict = Depends(require_admin)
):
    """Create new portfolio project"""
    try:
        data = await request.json()
        project = await portfolio_service.create(data)
        return JSONResponse({"project": project})
    except Exception as e:
        print(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail="Failed to create project")

@router.put("/{project_id}")
async def update_project(
    project_id: str,
    request: Request,
    user: dict = Depends(require_admin)
):
    """Update portfolio project"""
    try:
        data = await request.json()
        project = await portfolio_service.update(project_id, data)
        return JSONResponse({"project": project})
    except Exception as e:
        print(f"Error updating project: {e}")
        raise HTTPException(status_code=500, detail="Failed to update project")

@router.delete("/{project_id}")
async def delete_project(project_id: str, user: dict = Depends(require_admin)):
    """Delete portfolio project"""
    try:
        await portfolio_service.delete(project_id)
        return JSONResponse({"success": True})
    except Exception as e:
        print(f"Error deleting project: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete project")
