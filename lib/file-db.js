import fs from 'fs/promises';
import path from 'path';

/**
 * Get the base directory for data files
 * Priority: DATA_DIR env var > /tmp (production) > process.cwd() (development)
 */
function getBaseDir() {
  const envDataDir = process.env.DATA_DIR;
  
  if (envDataDir) {
    console.log('🔧 Using DATA_DIR from environment:', envDataDir);
    return envDataDir;
  }
  
  if (process.env.NODE_ENV === 'production') {
    console.log('🔧 Production environment: using /tmp directory');
    return '/tmp';
  }
  
  console.log('🔧 Development environment: using process.cwd()');
  return process.cwd();
}

/**
 * Ensure a file exists, creating it with default data if necessary
 */
export async function ensureFileExists(filePath, defaultData = []) {
  try {
    const baseDir = getBaseDir();
    const cleanPath = filePath.replace(/^\/?/, '');
    const absolutePath = path.join(baseDir, cleanPath);
    
    console.log('ensureFileExists - Checking file:', absolutePath);
    
    try {
      await fs.access(absolutePath);
      console.log('✅ File exists:', absolutePath);
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
    
    console.log('writeJSON - Final path:', absolutePath);
    
    // Write to temporary file first
    const tempPath = absolutePath + '.tmp';
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
    
    // Then rename to final file (atomic operation)
    await fs.rename(tempPath, absolutePath);
    
    console.log('✅ File written successfully');
    
    // Verify the write was successful
    try {
      const verifyData = await fs.readFile(absolutePath, 'utf8');
      const verifyParsed = JSON.parse(verifyData);
      console.log('✅ Write verification successful, data length:', verifyParsed.length);
    } catch (verifyError) {
      console.error('❌ Write verification failed:', verifyError.message);
      throw new Error('File write verification failed');
    }
  } catch (error) {
    console.error('❌ Error writing JSON file:', filePath, error.message);
    throw error;
  }
} 