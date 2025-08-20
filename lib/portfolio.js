import { readJSON, writeJSON } from './file-db.js';
import { unstable_noStore as noStore } from 'next/cache';

const portfolioFile = 'data/portfolio.json';

export async function getAllProjects() {
  try {
    noStore();
    const projects = await readJSON(portfolioFile);
    if (Array.isArray(projects) && projects.length > 0) return projects;
    // fallback to seed in production
    try {
      const seed = await readJSON('data/seed.portfolio.json');
      return Array.isArray(seed) ? seed : [];
    } catch (_) {
      return [];
    }
  } catch (error) {
    console.error('Error reading portfolio file:', error);
    try {
      const seed = await readJSON('data/seed.portfolio.json');
      return Array.isArray(seed) ? seed : [];
    } catch (_) {
      return [];
    }
  }
}

export async function getActiveProjects() {
  try {
    const projects = await getAllProjects();
    return projects.filter(project => project.active === true);
  } catch (error) {
    console.error('Error getting active projects:', error);
    return [];
  }
}

export async function getProjectById(id) {
  try {
    const projects = await getAllProjects();
    return projects.find(project => project.id === id) || null;
  } catch (error) {
    console.error('Error getting project by ID:', error);
    return null;
  }
}

export async function createProject(input) {
  try {
    console.log('createProject - Input received:', input);
    
    const projects = await getAllProjects();
    console.log('createProject - Current projects count:', projects.length);
    
    const newProject = {
      ...input,
      id: input.id || `project-${Date.now()}`,
      active: input.active !== undefined ? input.active : true,
      updatedAt: input.updatedAt || new Date().toISOString(),
      createdAt: input.createdAt || new Date().toISOString()
    };
    
    console.log('createProject - New project object:', newProject);
    
    projects.push(newProject);
    console.log('createProject - Projects array after push:', projects.length);
    
    await writeJSON(portfolioFile, projects);
    console.log('createProject - Project written to file successfully');
    
    return newProject;
  } catch (error) {
    console.error('createProject - Error:', error);
    throw new Error(`Failed to create project: ${error.message}`);
  }
}

export async function updateProject(id, patch) {
  try {
    const projects = await getAllProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    projects[index] = {
      ...projects[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSON(portfolioFile, projects);
    
    return projects[index];
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error(`Failed to update project: ${error.message}`);
  }
}

export async function deleteProject(id) {
  try {
    const projects = await getAllProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    
    if (filteredProjects.length === projects.length) {
      throw new Error('Project not found');
    }
    
    await writeJSON(portfolioFile, filteredProjects);
    
    return { ok: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
}

/**
 * Get projects by search term
 * @param {string} searchTerm - Search term to filter by
 * @returns {Promise<Array>} Array of filtered project objects
 */
export async function searchProjects(searchTerm) {
  const allProjects = await getAllProjects();
  
  if (!searchTerm) return allProjects;

  const term = searchTerm.toLowerCase();
  return allProjects.filter(project =>
    project.title.toLowerCase().includes(term) ||
    project.shortDesc.toLowerCase().includes(term) ||
    (project.longDesc && project.longDesc.toLowerCase().includes(term)) ||
    project.useCases.some(useCase => useCase.toLowerCase().includes(term))
  );
} 