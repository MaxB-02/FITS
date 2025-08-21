import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * Get the base directory for data files with better error handling
 * @returns {string} The base directory path
 */
function getBaseDir() {
  const dataDir = process.env.DATA_DIR;
  const cwd = process.cwd();
  
  console.log('🔧 Environment check:');
  console.log('- DATA_DIR:', dataDir);
  console.log('- process.cwd():', cwd);
  console.log('- process.env.NODE_ENV:', process.env.NODE_ENV);
  
  if (dataDir) {
    console.log('✅ Using DATA_DIR:', dataDir);
    return dataDir;
  } else {
    console.log('⚠️ DATA_DIR not set, using process.cwd():', cwd);
    return cwd;
  }
}

/**
 * Read and parse a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<any>} Parsed JSON data
 */
export async function readJSON(filePath) {
  try {
    const baseDir = getBaseDir();
    
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
    const baseDir = getBaseDir();
    
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
    console.log('📁 Creating directory:', dir);
    await fs.mkdir(dir, { recursive: true });
    
    const tempPath = `${filePath}.tmp`;
    const jsonString = JSON.stringify(data, null, 2);
    
    console.log('💾 Writing to temp file:', tempPath);
    // Write to temporary file first
    await fs.writeFile(tempPath, jsonString, 'utf8');
    
    console.log('🔄 Renaming temp file to final file');
    // Atomic rename operation
    await fs.rename(tempPath, filePath);
    
    console.log('✅ File written successfully');
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
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
  const baseDir = getBaseDir();
  
  // Resolve the path first; respect absolute inputs
  let absolutePath;
  if (path.isAbsolute(filePath)) {
    absolutePath = filePath;
  } else {
    const cleanPath = filePath.replace(/^\/?/, '');
    absolutePath = path.join(baseDir, cleanPath);
  }
  
  console.log('ensureFileExists - Checking file:', absolutePath);
  
  try {
    await fs.access(absolutePath);
    console.log('✅ File exists:', absolutePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('📝 File does not exist, creating with default data');
      // Use the resolved absolute path for writing
      await writeJSON(absolutePath, defaultData);
    } else {
      throw error;
    }
  }
} 