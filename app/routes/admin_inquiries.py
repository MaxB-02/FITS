from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from ..services.inquiries import inquiries_service
from ..middleware.auth import require_admin

router = APIRouter(prefix="/api/admin/inquiries", tags=["admin-inquiries"])

@router.get("/")
async def get_inquiries(user: dict = Depends(require_admin)):
    """Get all inquiries"""
    try:
        inquiries = await inquiries_service.get_all()
        return JSONResponse({"inquiries": inquiries})
    except Exception as e:
        print(f"Error getting inquiries: {e}")
        raise HTTPException(status_code=500, detail="Failed to get inquiries")

@router.get("/{inquiry_id}")
async def get_inquiry(inquiry_id: str, user: dict = Depends(require_admin)):
    """Get inquiry by ID"""
    try:
        inquiry = await inquiries_service.get_by_id(inquiry_id)
        if not inquiry:
            raise HTTPException(status_code=404, detail="Inquiry not found")
        return JSONResponse({"inquiry": inquiry})
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting inquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to get inquiry")

@router.put("/{inquiry_id}")
async def update_inquiry(
    inquiry_id: str,
    request: Request,
    user: dict = Depends(require_admin)
):
    """Update inquiry"""
    try:
        data = await request.json()
        inquiry = await inquiries_service.update(inquiry_id, data)
        return JSONResponse({"inquiry": inquiry, "success": True})
    except Exception as e:
        print(f"Error updating inquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to update inquiry")

@router.delete("/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, user: dict = Depends(require_admin)):
    """Delete inquiry"""
    try:
        await inquiries_service.delete(inquiry_id)
        return JSONResponse({"success": True})
    except Exception as e:
        print(f"Error deleting inquiry: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete inquiry")
