import { promises as fs } from 'node:fs';
import path from 'node:path';

// Helper function to get the appropriate base directory
function getBaseDir() {
  // If DATA_DIR is explicitly set, use it
  if (process.env.DATA_DIR) {
    return process.env.DATA_DIR;
  }
  
  // In production (AWS), use /tmp
  if (process.env.NODE_ENV === 'production') {
    return '/tmp';
  }
  
  // In development, use current working directory
  return process.cwd();
}

// Helper function to ensure a file exists with fallback logic
export async function ensureFileExists(filePath, defaultData = []) {
  try {
    // Resolve the path first
    const cleanPath = filePath.replace(/^\/?/, '');
    const baseDir = getBaseDir();
    const absolutePath = path.join(baseDir, cleanPath);
    
    try {
      // Check if file exists
      await fs.access(absolutePath);
      return absolutePath;
    } catch (accessError) {
      // Ensure directory exists
      const dir = path.dirname(absolutePath);
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (mkdirError) {
        console.log(`⚠️ Could not create directory: ${dir}`);
        console.log(`📝 Error: ${mkdirError.message}`);
        
        // If we're already using /tmp, we're out of options
        if (baseDir === '/tmp') {
          throw mkdirError;
        }
        
        // Try fallback to /tmp (but don't call ensureFileExists recursively)
        console.log(`🔄 Trying fallback to /tmp directory`);
        const fallbackPath = path.join('/tmp', cleanPath);
        const fallbackDir = path.dirname(fallbackPath);
        
        try {
          await fs.mkdir(fallbackDir, { recursive: true });
          await fs.writeFile(fallbackPath, JSON.stringify(defaultData, null, 2), 'utf8');
          console.log(`✅ Successfully created fallback file: ${fallbackPath}`);
          return fallbackPath;
        } catch (fallbackError) {
          console.log(`❌ Fallback also failed: ${fallbackError.message}`);
          throw fallbackError;
        }
      }
      
      // Write the file
      await fs.writeFile(absolutePath, JSON.stringify(defaultData, null, 2), 'utf8');
      console.log(`✅ File created successfully: ${absolutePath}`);
      return absolutePath;
    }
  } catch (error) {
    console.error('❌ Critical error in ensureFileExists:', error);
    throw error;
  }
}

export async function readJSON(filePath) {
  try {
    // Use DATA_DIR environment variable for data files, fallback to process.cwd()
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
    
    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data);
    return parsed;
  } catch (error) {
    console.error('❌ Error reading JSON file:', filePath, error.message);
    
    // If this is a critical file and we're in production, try to create it
    if (process.env.NODE_ENV === 'production' && !filePath.includes('/tmp')) {
      console.log('🔄 Production environment: attempting to create missing file');
      try {
        const absolutePath = await ensureFileExists(filePath, []);
        const data = await fs.readFile(absolutePath, 'utf8');
        return JSON.parse(data);
      } catch (createError) {
        console.error('❌ Failed to create file in production:', createError.message);
        // Return empty array as last resort
        return [];
      }
    }
    
    throw error;
  }
}

export async function writeJSON(filePath, data) {
  try {
    // Ensure the file exists first
    const absolutePath = await ensureFileExists(filePath, []);
    
    // Write to temporary file first
    const tempPath = absolutePath + '.tmp';
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
    
    // Then rename to final file (atomic operation)
    await fs.rename(tempPath, absolutePath);
    
    console.log('✅ File written successfully');
  } catch (error) {
    console.error('❌ Error writing JSON file:', filePath, error.message);
    throw error;
  }
} 