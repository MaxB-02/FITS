import fs from 'fs/promises';
import path from 'path';

/**
 * Modern Database System for FITS
 * Handles inquiries, templates, and portfolio projects with proper error handling
 */

class Database {
  constructor() {
    this.baseDir = this.getBaseDir();
    this.dataDir = path.join(this.baseDir, 'data');
    this.uploadsDir = path.join(this.baseDir, 'uploads');
    this.ensureDirectories();
  }

  /**
   * Get the appropriate base directory for the current environment
   */
  getBaseDir() {
    if (process.env.DATA_DIR) {
      return process.env.DATA_DIR;
    }
    
    if (process.env.NODE_ENV === 'production') {
      return '/tmp';
    }
    
    return process.cwd();
  }

  /**
   * Ensure all necessary directories exist
   */
  async ensureDirectories() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.mkdir(this.uploadsDir, { recursive: true });
      console.log('✅ Database directories ensured');
    } catch (error) {
      console.error('❌ Failed to create directories:', error);
    }
  }

  /**
   * Read JSON data from a file with fallback
   */
  async readData(filename, defaultValue = []) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.readFile(filePath, 'utf8');
      const parsed = JSON.parse(data);
      
      // Validate that we got an array
      if (!Array.isArray(parsed)) {
        console.warn(`⚠️ ${filename} is not an array, using default`);
        return defaultValue;
      }
      
      return parsed;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create it with default data
        await this.writeData(filename, defaultValue);
        return defaultValue;
      }
      
      console.error(`❌ Error reading ${filename}:`, error);
      return defaultValue;
    }
  }

  /**
   * Write JSON data to a file with atomic operation
   */
  async writeData(filename, data) {
    try {
      const filePath = path.join(this.dataDir, filename);
      const tempPath = filePath + '.tmp';
      
      // Write to temporary file first
      await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
      
      // Then rename to final file (atomic operation)
      await fs.rename(tempPath, filePath);
      
      console.log(`✅ Data written to ${filename}`);
      return true;
    } catch (error) {
      console.error(`❌ Error writing ${filename}:`, error);
      throw error;
    }
  }

  /**
   * Generate a unique ID
   */
  generateId(prefix = 'item') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Get current timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }
}

// Create and export a single database instance
const db = new Database();
export default db;
