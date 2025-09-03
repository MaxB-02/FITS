from typing import List, Dict, Any, Optional
from .database import db

class TemplatesService:
    def __init__(self):
        self.filename = 'templates.json'
    
    async def get_all(self) -> List[Dict[str, Any]]:
        """Get all templates"""
        try:
            templates = await db.read_data(self.filename, [])
            return templates
        except Exception as e:
            print(f"Error getting all templates: {e}")
            return []
    
    async def get_by_id(self, template_id: str) -> Optional[Dict[str, Any]]:
        """Get template by ID"""
        try:
            templates = await self.get_all()
            return next((tpl for tpl in templates if tpl.get('id') == template_id), None)
        except Exception as e:
            print(f"Error getting template by ID: {e}")
            return None
    
    async def create(self, template_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new template"""
        try:
            templates = await self.get_all()
            
            new_template = {
                'id': db.generate_id('template'),
                'createdAt': db.get_timestamp(),
                **template_data
            }
            
            templates.append(new_template)
            await db.write_data(self.filename, templates)
            
            print(f"✅ Template created successfully: {new_template['id']}")
            return new_template
        except Exception as e:
            print(f"Error creating template: {e}")
            raise Exception("Failed to create template")
    
    async def update(self, template_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update template"""
        try:
            templates = await self.get_all()
            index = next((i for i, tpl in enumerate(templates) if tpl.get('id') == template_id), -1)
            
            if index == -1:
                raise Exception("Template not found")
            
            templates[index] = {
                **templates[index],
                **updates,
                'updatedAt': db.get_timestamp()
            }
            
            await db.write_data(self.filename, templates)
            print(f"✅ Template updated successfully: {template_id}")
            return templates[index]
        except Exception as e:
            print(f"Error updating template: {e}")
            raise Exception("Failed to update template")
    
    async def delete(self, template_id: str) -> bool:
        """Delete template"""
        try:
            templates = await self.get_all()
            filtered_templates = [tpl for tpl in templates if tpl.get('id') != template_id]
            
            if len(filtered_templates) == len(templates):
                raise Exception("Template not found")
            
            await db.write_data(self.filename, filtered_templates)
            print(f"✅ Template deleted successfully: {template_id}")
            return True
        except Exception as e:
            print(f"Error deleting template: {e}")
            raise Exception("Failed to delete template")

# Global service instance
templates_service = TemplatesService()
