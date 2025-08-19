import { readJSON, writeJSON } from './file-db.js';
import path from 'path';

const templatesFile = 'data/templates.json';

export async function getAllTemplates() {
  try {
    const data = await readJSON(templatesFile);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading templates:', error);
    return [];
  }
}

export async function getActiveTemplates() {
  try {
    const templates = await getAllTemplates();
    return templates.filter(template => template.active === true);
  } catch (error) {
    console.error('Error getting active templates:', error);
    return [];
  }
}

export async function getTemplateById(id) {
  try {
    const templates = await getAllTemplates();
    return templates.find(template => template.id === id) || null;
  } catch (error) {
    console.error('Error getting template by ID:', error);
    return null;
  }
}

export async function createTemplate(input) {
  try {
    console.log('createTemplate - Input received:', input);
    
    const templates = await getAllTemplates();
    console.log('createTemplate - Current templates count:', templates.length);
    
    const newTemplate = {
      ...input,
      id: input.id || `template-${Date.now()}`,
      active: input.active !== undefined ? input.active : false,
      updatedAt: input.updatedAt || new Date().toISOString(),
      createdAt: input.createdAt || new Date().toISOString()
    };
    
    console.log('createTemplate - New template object:', newTemplate);
    
    templates.push(newTemplate);
    console.log('createTemplate - Templates array after push:', templates.length);
    
    await writeJSON(templatesFile, templates);
    console.log('createTemplate - Template written to file successfully');
    
    return newTemplate;
  } catch (error) {
    console.error('createTemplate - Error:', error);
    throw new Error(`Failed to create template: ${error.message}`);
  }
}

export async function updateTemplate(id, patch) {
  try {
    const templates = await getAllTemplates();
    const index = templates.findIndex(template => template.id === id);
    
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    templates[index] = {
      ...templates[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSON(templatesFile, templates);
    
    return templates[index];
  } catch (error) {
    console.error('Error updating template:', error);
    throw new Error(`Failed to update template: ${error.message}`);
  }
}

export async function deleteTemplate(id) {
  try {
    const templates = await getAllTemplates();
    const filteredTemplates = templates.filter(template => template.id !== id);
    
    if (filteredTemplates.length === templates.length) {
      throw new Error('Template not found');
    }
    
    await writeJSON(templatesFile, filteredTemplates);
    
    return { ok: true };
  } catch (error) {
    console.error('Error deleting template:', error);
    throw new Error(`Failed to update template: ${error.message}`);
  }
}

/**
 * Get templates by category or search term
 * @param {string} searchTerm - Search term to filter by
 * @returns {Promise<Array>} Array of filtered template objects
 */
export async function searchTemplates(searchTerm) {
  const allTemplates = await getAllTemplates();
  
  if (!searchTerm) return allTemplates;

  const term = searchTerm.toLowerCase();
  return allTemplates.filter(template =>
    template.name.toLowerCase().includes(term) ||
    template.shortDesc.toLowerCase().includes(term) ||
    template.longDesc.toLowerCase().includes(term) ||
    template.features.some(feature => feature.toLowerCase().includes(term)) ||
    template.useCases.some(useCase => useCase.toLowerCase().includes(term))
  );
} 