from typing import List, Dict, Any, Optional
from .database import db

class InquiriesService:
    def __init__(self):
        self.filename = 'leads.json'
    
    async def get_all(self) -> List[Dict[str, Any]]:
        """Get all inquiries sorted by creation date"""
        try:
            inquiries = await db.read_data(self.filename, [])
            return sorted(inquiries, key=lambda x: x.get('createdAt', ''), reverse=True)
        except Exception as e:
            print(f"Error getting all inquiries: {e}")
            return []
    
    async def get_by_id(self, inquiry_id: str) -> Optional[Dict[str, Any]]:
        """Get inquiry by ID"""
        try:
            inquiries = await self.get_all()
            return next((inq for inq in inquiries if inq.get('id') == inquiry_id), None)
        except Exception as e:
            print(f"Error getting inquiry by ID: {e}")
            return None
    
    async def create(self, inquiry_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new inquiry"""
        try:
            inquiries = await self.get_all()
            
            new_inquiry = {
                'id': db.generate_id('inquiry'),
                'createdAt': db.get_timestamp(),
                'status': 'new',
                **inquiry_data
            }
            
            inquiries.append(new_inquiry)
            await db.write_data(self.filename, inquiries)
            
            print(f"✅ Inquiry created successfully: {new_inquiry['id']}")
            return new_inquiry
        except Exception as e:
            print(f"Error creating inquiry: {e}")
            raise Exception("Failed to create inquiry")
    
    async def update(self, inquiry_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update inquiry"""
        try:
            inquiries = await self.get_all()
            index = next((i for i, inq in enumerate(inquiries) if inq.get('id') == inquiry_id), -1)
            
            if index == -1:
                raise Exception("Inquiry not found")
            
            # Update status-specific timestamps
            if updates.get('status') in ['accepted', 'declined']:
                updates['reviewedAt'] = db.get_timestamp()
            
            inquiries[index] = {
                **inquiries[index],
                **updates,
                'updatedAt': db.get_timestamp()
            }
            
            await db.write_data(self.filename, inquiries)
            print(f"✅ Inquiry updated successfully: {inquiry_id}")
            return inquiries[index]
        except Exception as e:
            print(f"Error updating inquiry: {e}")
            raise Exception("Failed to update inquiry")
    
    async def delete(self, inquiry_id: str) -> bool:
        """Delete inquiry"""
        try:
            inquiries = await self.get_all()
            filtered_inquiries = [inq for inq in inquiries if inq.get('id') != inquiry_id]
            
            if len(filtered_inquiries) == len(inquiries):
                raise Exception("Inquiry not found")
            
            await db.write_data(self.filename, filtered_inquiries)
            print(f"✅ Inquiry deleted successfully: {inquiry_id}")
            return True
        except Exception as e:
            print(f"Error deleting inquiry: {e}")
            raise Exception("Failed to delete inquiry")
    
    async def get_by_status(self, status: str) -> List[Dict[str, Any]]:
        """Get inquiries by status"""
        try:
            inquiries = await self.get_all()
            return [inq for inq in inquiries if inq.get('status') == status]
        except Exception as e:
            print(f"Error getting inquiries by status: {e}")
            return []
    
    async def get_stats(self) -> Dict[str, int]:
        """Get inquiry statistics"""
        try:
            inquiries = await self.get_all()
            return {
                'total': len(inquiries),
                'new': len([inq for inq in inquiries if inq.get('status') == 'new']),
                'accepted': len([inq for inq in inquiries if inq.get('status') == 'accepted']),
                'declined': len([inq for inq in inquiries if inq.get('status') == 'declined'])
            }
        except Exception as e:
            print(f"Error getting inquiry stats: {e}")
            return {'total': 0, 'new': 0, 'accepted': 0, 'declined': 0}

# Global service instance
inquiries_service = InquiriesService()
