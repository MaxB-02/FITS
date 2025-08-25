import { promises as fs } from 'node:fs';
import path from 'node:path';

// Helper function to get the appropriate base directory
function getBaseDir() {
  // If DATA_DIR is explicitly set, use it
  if (process.env.DATA_DIR) {
    return process.env.DATA_DIR;
  }
  
  // In production (AWS), fallback to /tmp
  if (process.env.NODE_ENV === 'production') {
    console.log('🌐 Production environment detected, using /tmp as fallback');
    return '/tmp';
  }
  
  // In development, use current working directory
  return process.cwd();
}

// Helper function to ensure a file exists with fallback logic
async function ensureFileExists(filePath, defaultData = []) {
  try {
    // Resolve the path first
    const cleanPath = filePath.replace(/^\/?/, '');
    const baseDir = getBaseDir();
    const absolutePath = path.join(baseDir, cleanPath);
    
    console.log(`🔧 Environment check:`);
    console.log(`- DATA_DIR: ${process.env.DATA_DIR}`);
    console.log(`- process.cwd(): ${process.cwd()}`);
    console.log(`- process.env.NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`- Using base directory: ${baseDir}`);
    
    try {
      // Check if file exists
      await fs.access(absolutePath);
      console.log(`✅ File exists: ${absolutePath}`);
      return absolutePath;
    } catch (accessError) {
      console.log(`📝 File doesn't exist, creating: ${absolutePath}`);
      
      // Ensure directory exists
      const dir = path.dirname(absolutePath);
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      } catch (mkdirError) {
        console.log(`⚠️ Could not create directory: ${dir}`);
        console.log(`📝 Error: ${mkdirError.message}`);
      }
      
      // Try to write the file
      try {
        await writeJSON(absolutePath, defaultData);
        console.log(`✅ File created successfully: ${absolutePath}`);
        return absolutePath;
      } catch (writeError) {
        console.log(`❌ Failed to write to primary location: ${absolutePath}`);
        console.log(`📝 Error: ${writeError.message}`);
        
        // If we're already using /tmp, we're out of options
        if (baseDir === '/tmp') {
          throw writeError;
        }
        
        // Try fallback to /tmp
        console.log(`🔄 Trying fallback to /tmp directory`);
        const fallbackPath = path.join('/tmp', cleanPath);
        
        try {
          await fs.mkdir(path.dirname(fallbackPath), { recursive: true });
          await writeJSON(fallbackPath, defaultData);
          console.log(`✅ Successfully created fallback file: ${fallbackPath}`);
          return fallbackPath;
        } catch (fallbackError) {
          console.log(`❌ Fallback also failed: ${fallbackError.message}`);
          throw fallbackError;
        }
      }
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
    
    console.log('readJSON - Final path:', filePath);
    
    const data = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(data);
    console.log('readJSON - File content length:', data.length);
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
    
    console.log('💾 Writing to temp file:', absolutePath + '.tmp');
    
    // Write to temporary file first
    const tempPath = absolutePath + '.tmp';
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log('🔄 Renaming temp file to final file');
    
    // Then rename to final file (atomic operation)
    await fs.rename(tempPath, absolutePath);
    
    console.log('✅ File written successfully');
  } catch (error) {
    console.error('❌ Error writing JSON file:', filePath, error.message);
    throw error;
  }
} 