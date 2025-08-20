import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Read and parse a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<any>} Parsed JSON data
 */
export async function readJSON(filePath) {
  try {
    // Use DATA_DIR environment variable for data files, fallback to process.cwd()
    const baseDir = process.env.DATA_DIR || process.cwd();
    
    // If the path is already absolute, use it as is
    if (path.isAbsolute(filePath)) {
      console.log('readJSON - Path is already absolute:', filePath);
    } else {
      // Resolve relative path using the appropriate base directory
      const cleanPath = filePath.replace(/^\/?/, '');
      const absolutePath = path.join(baseDir, cleanPath);
      filePath = absolutePath;
    }
    
    console.log('readJSON - Final path:', filePath);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      console.log('readJSON - File content length:', content.length);
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array as default
        console.log('readJSON - File not found, returning empty array');
        return [];
      }
      throw error;
    }
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Write data to a JSON file with atomic write operation
 * @param {string} filePath - Path to the JSON file
 * @param {any} data - Data to write
 * @returns {Promise<void>}
 */
export async function writeJSON(filePath, data) {
  try {
    // Use DATA_DIR environment variable for data files, fallback to process.cwd()
    const baseDir = process.env.DATA_DIR || process.cwd();
    
    // If the path is already absolute, use it as is
    if (path.isAbsolute(filePath)) {
      console.log('writeJSON - Path is already absolute:', filePath);
    } else {
      // Resolve relative path using the appropriate base directory
      const cleanPath = filePath.replace(/^\/?/, '');
      const absolutePath = path.join(baseDir, cleanPath);
      filePath = absolutePath;
    }
    
    console.log('writeJSON - Final path:', filePath);
    const dir = path.dirname(filePath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    
    const tempPath = `${filePath}.tmp`;
    const jsonString = JSON.stringify(data, null, 2);
    
    // Write to temporary file first
    await fs.writeFile(tempPath, jsonString, 'utf8');
    
    // Atomic rename operation
    await fs.rename(tempPath, filePath);
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    throw error;
  }
}

/**
 * Ensure a file exists, creating it with default data if it doesn't
 * @param {string} filePath - Path to the file
 * @param {any} defaultData - Default data to write if file doesn't exist
 * @returns {Promise<void>}
 */
export async function ensureFileExists(filePath, defaultData) {
  // Use DATA_DIR environment variable for data files, fallback to process.cwd()
  const baseDir = process.env.DATA_DIR || process.cwd();
  
  // Resolve the path first; respect absolute inputs
  let absolutePath;
  if (path.isAbsolute(filePath)) {
    absolutePath = filePath;
  } else {
    const cleanPath = filePath.replace(/^\/?/, '');
    absolutePath = path.join(baseDir, cleanPath);
  }
  
  try {
    await fs.access(absolutePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Use the resolved absolute path for writing
      await writeJSON(absolutePath, defaultData);
    } else {
      throw error;
    }
  }
} 