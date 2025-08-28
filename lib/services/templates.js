import db from '../database.js';

/**
 * Templates Service
 * Handles all template-related database operations
 */

export class TemplatesService {
  constructor() {
    this.filename = 'templates.json';
  }

  /**
   * Get all templates
   */
  async getAll() {
    try {
      const templates = await db.readData(this.filename, []);
      return templates.sort((a, b) => 
        new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error getting all templates:', error);
      return [];
    }
  }

  /**
   * Get active templates only
   */
  async getActive() {
    try {
      const templates = await this.getAll();
      return templates.filter(template => template.active !== false);
    } catch (error) {
      console.error('Error getting active templates:', error);
      return [];
    }
  }

  /**
   * Get template by ID
   */
  async getById(id) {
    try {
      const templates = await this.getAll();
      return templates.find(template => template.id === id) || null;
    } catch (error) {
      console.error('Error getting template by ID:', error);
      return null;
    }
  }

  /**
   * Create new template
   */
  async create(templateData) {
    try {
      const templates = await this.getAll();
      
      const newTemplate = {
        id: db.generateId('template'),
        createdAt: db.getTimestamp(),
        updatedAt: db.getTimestamp(),
        active: true,
        ...templateData
      };

      templates.push(newTemplate);
      await db.writeData(this.filename, templates);
      
      console.log('✅ Template created successfully:', newTemplate.id);
      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }
  }

  /**
   * Update template
   */
  async update(id, updates) {
    try {
      const templates = await this.getAll();
      const index = templates.findIndex(template => template.id === id);
      
      if (index === -1) {
        throw new Error('Template not found');
      }

      templates[index] = { 
        ...templates[index], 
        ...updates,
        updatedAt: db.getTimestamp()
      };

      await db.writeData(this.filename, templates);
      
      console.log('✅ Template updated successfully:', id);
      return templates[index];
    } catch (error) {
      console.error('Error updating template:', error);
      throw new Error('Failed to update template');
    }
  }

  /**
   * Delete template
   */
  async delete(id) {
    try {
      const templates = await this.getAll();
      const filteredTemplates = templates.filter(template => template.id !== id);
      
      if (filteredTemplates.length === templates.length) {
        throw new Error('Template not found');
      }

      await db.writeData(this.filename, filteredTemplates);
      
      console.log('✅ Template deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw new Error('Failed to delete template');
    }
  }

  /**
   * Search templates
   */
  async search(searchTerm) {
    try {
      const templates = await this.getAll();
      
      if (!searchTerm) return templates;

      const term = searchTerm.toLowerCase();
      return templates.filter(template =>
        template.name?.toLowerCase().includes(term) ||
        template.shortDesc?.toLowerCase().includes(term) ||
        template.longDesc?.toLowerCase().includes(term) ||
        template.features?.some(feature => feature.toLowerCase().includes(term)) ||
        template.useCases?.some(useCase => useCase.toLowerCase().includes(term))
      );
    } catch (error) {
      console.error('Error searching templates:', error);
      return [];
    }
  }
}

// Create and export a single instance
const templatesService = new TemplatesService();
export default templatesService;
