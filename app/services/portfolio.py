from typing import List, Dict, Any, Optional
from .database import db

class PortfolioService:
    def __init__(self):
        self.filename = 'portfolio.json'
    
    async def get_all(self) -> List[Dict[str, Any]]:
        """Get all portfolio projects"""
        try:
            projects = await db.read_data(self.filename, [])
            return projects
        except Exception as e:
            print(f"Error getting all portfolio projects: {e}")
            return []
    
    async def get_by_id(self, project_id: str) -> Optional[Dict[str, Any]]:
        """Get portfolio project by ID"""
        try:
            projects = await self.get_all()
            return next((proj for proj in projects if proj.get('id') == project_id), None)
        except Exception as e:
            print(f"Error getting portfolio project by ID: {e}")
            return None
    
    async def create(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create new portfolio project"""
        try:
            projects = await self.get_all()
            
            new_project = {
                'id': db.generate_id('project'),
                'createdAt': db.get_timestamp(),
                **project_data
            }
            
            projects.append(new_project)
            await db.write_data(self.filename, projects)
            
            print(f"✅ Portfolio project created successfully: {new_project['id']}")
            return new_project
        except Exception as e:
            print(f"Error creating portfolio project: {e}")
            raise Exception("Failed to create portfolio project")
    
    async def update(self, project_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update portfolio project"""
        try:
            projects = await self.get_all()
            index = next((i for i, proj in enumerate(projects) if proj.get('id') == project_id), -1)
            
            if index == -1:
                raise Exception("Portfolio project not found")
            
            projects[index] = {
                **projects[index],
                **updates,
                'updatedAt': db.get_timestamp()
            }
            
            await db.write_data(self.filename, projects)
            print(f"✅ Portfolio project updated successfully: {project_id}")
            return projects[index]
        except Exception as e:
            print(f"Error updating portfolio project: {e}")
            raise Exception("Failed to update portfolio project")
    
    async def delete(self, project_id: str) -> bool:
        """Delete portfolio project"""
        try:
            projects = await self.get_all()
            filtered_projects = [proj for proj in projects if proj.get('id') != project_id]
            
            if len(filtered_projects) == len(projects):
                raise Exception("Portfolio project not found")
            
            await db.write_data(self.filename, filtered_projects)
            print(f"✅ Portfolio project deleted successfully: {project_id}")
            return True
        except Exception as e:
            print(f"Error deleting portfolio project: {e}")
            raise Exception("Failed to delete portfolio project")

# Global service instance
portfolio_service = PortfolioService()
