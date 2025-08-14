import { promises as fs } from 'fs';
import path from 'path';
import { getObjectText, putObjectText } from './aws-s3.js';

// Environment-based storage configuration
const isProduction = process.env.NODE_ENV === 'production';
const s3Bucket = process.env.S3_BUCKET;
const s3Prefix = 'fits';

// Fallback to seed data if production data is empty
async function getSeedData(type) {
  try {
    const seedFile = path.join(process.cwd(), 'data', `seed.${type}.json`);
    const content = await fs.readFile(seedFile, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to load seed data for ${type}:`, error);
    return [];
  }
}

// Generic JSON storage functions
export async function readJSON(key) {
  if (isProduction) {
    try {
      if (!s3Bucket) {
        console.warn('S3_BUCKET not configured, falling back to seed data');
        return await getSeedData(key);
      }
      
      const s3Key = `${s3Prefix}/${key}.json`;
      const content = await getObjectText(s3Bucket, s3Key);
      
      if (!content) {
        console.warn(`No data found in S3 for ${key}, using seed data`);
        return await getSeedData(key);
      }
      
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading from S3 for ${key}:`, error);
      console.warn(`Falling back to seed data for ${key}`);
      return await getSeedData(key);
    }
  } else {
    // Development: use local files
    try {
      const filePath = path.join(process.cwd(), 'data', `${key}.json`);
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading local file for ${key}:`, error);
      return [];
    }
  }
}

export async function writeJSON(key, data) {
  if (isProduction) {
    if (!s3Bucket) {
      throw new Error('S3_BUCKET environment variable not configured');
    }
    
    const s3Key = `${s3Prefix}/${key}.json`;
    const content = JSON.stringify(data, null, 2);
    await putObjectText(s3Bucket, s3Key, content);
  } else {
    // Development: use local files with atomic write
    const filePath = path.join(process.cwd(), 'data', `${key}.json`);
    const tmpPath = `${filePath}.tmp`;
    
    try {
      await fs.writeFile(tmpPath, JSON.stringify(data, null, 2));
      await fs.rename(tmpPath, filePath);
    } catch (error) {
      // Clean up temp file if rename fails
      try {
        await fs.unlink(tmpPath);
      } catch {}
      throw error;
    }
  }
}

// Convenience wrappers
export async function getTemplates() {
  return readJSON('templates');
}

export async function setTemplates(data) {
  return writeJSON('templates', data);
}

export async function getPortfolio() {
  return readJSON('portfolio');
}

export async function setPortfolio(data) {
  return writeJSON('portfolio', data);
}

export async function getLeads() {
  return readJSON('leads');
}

export async function setLeads(data) {
  return writeJSON('leads', data);
} 