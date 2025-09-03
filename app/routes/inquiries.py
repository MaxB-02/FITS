from fastapi import APIRouter, Request, Form, File, UploadFile, HTTPException, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from typing import List, Optional
import os
import re
from pathlib import Path
from ..services.inquiries import inquiries_service

router = APIRouter(prefix="/api/inquire", tags=["inquiries"])

@router.post("/")
async def create_inquiry(
    request: Request,
    name: str = Form(...),
    email: str = Form(...),
    company: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    description: str = Form(...),
    services: List[str] = Form([]),
    has_existing_system: bool = Form(False),
    budget_low: Optional[float] = Form(None),
    budget_high: Optional[float] = Form(None),
    desired_date: Optional[str] = Form(None),
    template_id: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """Create a new inquiry (equivalent to your current /api/inquire/route.js)"""
    try:
        print("🚀 Processing new inquiry submission...")
        
        # Handle file upload if present
        file_path = None
        if file and file.filename:
            print(f"📎 Processing file upload: {file.filename}")
            
            # Create uploads directory
            uploads_dir = Path("uploads")
            uploads_dir.mkdir(exist_ok=True)
            
            # Generate unique filename
            import time
            timestamp = int(time.time() * 1000)
            file_extension = Path(file.filename).suffix
            filename = f"inquiry-{timestamp}{file_extension}"
            upload_path = uploads_dir / filename
            
            # Save file
            with open(upload_path, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            file_path = f"uploads/{filename}"
            print(f"✅ File uploaded successfully: {upload_path}")
        
        # Prepare inquiry data
        inquiry_data = {
            'name': name,
            'email': email,
            'company': company,
            'phone': phone,
            'services': services,
            'description': description,
            'hasExistingSystem': has_existing_system,
            'budgetLow': budget_low,
            'budgetHigh': budget_high,
            'desiredDate': desired_date,
            'templateId': template_id,
            'filePath': file_path
        }
        
        # Basic validation
        if not name or not email or not description:
            raise HTTPException(status_code=400, detail="Missing required fields: name, email, description")
        
        # Email validation
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, email):
            raise HTTPException(status_code=400, detail="Invalid email address")
        
        # Budget validation
        if budget_low and budget_high and budget_low > budget_high:
            raise HTTPException(status_code=400, detail="Budget high must be greater than or equal to budget low")
        
        print("✅ Validation passed, creating inquiry...")
        
        # Create inquiry
        inquiry = await inquiries_service.create(inquiry_data)
        print(f"✅ Inquiry created successfully: {inquiry['id']}")
        
        # Send email notification (if configured)
        if os.getenv('RESEND_API_KEY'):
            try:
                import resend
                resend.api_key = os.getenv('RESEND_API_KEY')
                
                email_content = f"""
                <h2>New Project Inquiry</h2>
                <p><strong>Name:</strong> {inquiry['name']}</p>
                <p><strong>Email:</strong> {inquiry['email']}</p>
                {f"<p><strong>Company:</strong> {inquiry['company']}</p>" if inquiry.get('company') else ''}
                {f"<p><strong>Phone:</strong> {inquiry['phone']}</p>" if inquiry.get('phone') else ''}
                <p><strong>Description:</strong> {inquiry['description']}</p>
                {f"<p><strong>Budget:</strong> ${inquiry.get('budgetLow', '0')} - ${inquiry.get('budgetHigh', 'Unlimited')}</p>" if inquiry.get('budgetLow') or inquiry.get('budgetHigh') else ''}
                {f"<p><strong>Has Existing System:</strong> Yes</p>" if inquiry.get('hasExistingSystem') else ''}
                {f"<p><strong>File Uploaded:</strong> {inquiry['filePath']}</p>" if inquiry.get('filePath') else ''}
                {f"<p><strong>Desired Date:</strong> {inquiry['desiredDate']}</p>" if inquiry.get('desiredDate') else ''}
                {f"<p><strong>Template ID:</strong> {inquiry['templateId']}</p>" if inquiry.get('templateId') else ''}
                """
                
                resend.Emails.send({
                    'from': 'noreply@freakinthesheets.com',
                    'to': [os.getenv('NOTIFICATION_EMAIL', 'admin@freakinthesheets.com')],
                    'subject': f"New Project Inquiry: {inquiry['name']}",
                    'html': email_content
                })
                
                print("✅ Email notification sent successfully")
            except Exception as e:
                print(f"❌ Error sending email notification: {e}")
        
        # Check if this is an AJAX request
        accept_header = request.headers.get('accept', '')
        is_ajax = 'application/json' in accept_header or request.headers.get('x-requested-with') == 'XMLHttpRequest'
        
        if is_ajax:
            print("📱 Returning JSON response for AJAX request")
            return JSONResponse({
                'success': True,
                'id': inquiry['id'],
                'message': 'Inquiry submitted successfully'
            })
        else:
            print("🌐 Redirecting to thank you page for form submission")
            return RedirectResponse(url="/thank-you", status_code=303)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 Error processing inquiry: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process inquiry: {str(e)}")
