import db from '../database.js';

/**
 * Portfolio Service
 * Handles all portfolio project-related database operations
 */

export class PortfolioService {
  constructor() {
    this.filename = 'portfolio.json';
  }

  /**
   * Get all projects
   */
  async getAll() {
    try {
      const projects = await db.readData(this.filename, []);
      return projects.sort((a, b) => 
        new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error getting all projects:', error);
      return [];
    }
  }

  /**
   * Get active projects only
   */
  async getActive() {
    try {
      const projects = await this.getAll();
      return projects.filter(project => project.active !== false);
    } catch (error) {
      console.error('Error getting active projects:', error);
      return [];
    }
  }

  /**
   * Get project by ID
   */
  async getById(id) {
    try {
      const projects = await this.getAll();
      return projects.find(project => project.id === id) || null;
    } catch (error) {
      console.error('Error getting project by ID:', error);
      return null;
    }
  }

  /**
   * Create new project
   */
  async create(projectData) {
    try {
      const projects = await this.getAll();
      
      const newProject = {
        id: db.generateId('project'),
        createdAt: db.getTimestamp(),
        updatedAt: db.getTimestamp(),
        active: true,
        ...projectData
      };

      projects.push(newProject);
      await db.writeData(this.filename, projects);
      
      console.log('✅ Project created successfully:', newProject.id);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  /**
   * Update project
   */
  async update(id, updates) {
    try {
      const projects = await this.getAll();
      const index = projects.findIndex(project => project.id === id);
      
      if (index === -1) {
        throw new Error('Project not found');
      }

      projects[index] = { 
        ...projects[index], 
        ...updates,
        updatedAt: db.getTimestamp()
      };

      await db.writeData(this.filename, projects);
      
      console.log('✅ Project updated successfully:', id);
      return projects[index];
    } catch (error) {
      console.error('Error updating project:', error);
      throw new Error('Failed to update project');
    }
  }

  /**
   * Delete project
   */
  async delete(id) {
    try {
      const projects = await this.getAll();
      const filteredProjects = projects.filter(project => project.id !== id);
      
      if (filteredProjects.length === projects.length) {
        throw new Error('Project not found');
      }

      await db.writeData(this.filename, filteredProjects);
      
      console.log('✅ Project deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw new Error('Failed to delete project');
    }
  }

  /**
   * Search projects
   */
  async search(searchTerm) {
    try {
      const projects = await this.getAll();
      
      if (!searchTerm) return projects;

      const term = searchTerm.toLowerCase();
      return projects.filter(project =>
        project.title?.toLowerCase().includes(term) ||
        project.shortDesc?.toLowerCase().includes(term) ||
        project.longDesc?.toLowerCase().includes(term) ||
        project.useCases?.some(useCase => useCase.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Error searching projects:', error);
      return [];
    }
  }
}

// Create and export a single instance
const portfolioService = new PortfolioService();
export default portfolioService;
