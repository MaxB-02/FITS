import { readJSON, writeJSON, ensureFileExists } from './file-db.js';
import path from 'path';
import fs from 'fs/promises';

// Allow overriding data directory for server environments (e.g., AWS)
const DATA_DIR = process.env.DATA_DIR || 'data';
// Use /tmp when DATA_DIR is explicitly set to /tmp
const LEADS_FILE = path.isAbsolute(DATA_DIR)
  ? path.join(DATA_DIR, 'leads.json')
  : path.join(process.cwd(), DATA_DIR, 'leads.json');

// Fallback file path for serverless environments
const FALLBACK_LEADS_FILE = '/tmp/leads.json';

// Initialize the leads file if it doesn't exist
async function initializeLeadsFile() {
  try {
    await ensureFileExists(LEADS_FILE, []);
  } catch (error) {
    console.log('⚠️ Primary leads file failed, trying fallback');
    try {
      await ensureFileExists(FALLBACK_LEADS_FILE, []);
    } catch (fallbackError) {
      console.error('❌ Both primary and fallback failed:', fallbackError);
      throw fallbackError;
    }
  }
}

/**
 * Get the actual leads file path, trying fallback if primary fails
 * @returns {Promise<string>} Path to the leads file
 */
async function getLeadsFilePath() {
  try {
    await fs.access(LEADS_FILE);
    return LEADS_FILE;
  } catch (error) {
    console.log('📁 Primary leads file not accessible, using fallback');
    return FALLBACK_LEADS_FILE;
  }
}

/**
 * Get all inquiries, sorted newest first
 * @returns {Promise<Array>} Array of inquiry objects
 */
export async function getAllInquiries() {
  await initializeLeadsFile();

  try {
    const leadsFilePath = await getLeadsFilePath();
    console.log('Reading inquiries from:', leadsFilePath);
    console.log('Current working directory:', process.cwd());
    
    // Pass the absolute path directly
    const inquiries = await readJSON(leadsFilePath);
    console.log('Successfully read inquiries, count:', inquiries.length);
    
    return inquiries.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error reading inquiries:', error);
    return [];
  }
}

/**
 * Get a single inquiry by ID
 * @param {string} id - Inquiry ID
 * @returns {Promise<Object|null>} Inquiry object or null if not found
 */
export async function getInquiryById(id) {
  await initializeLeadsFile();

  try {
    const inquiries = await readJSON(LEADS_FILE);
    return inquiries.find(inquiry => inquiry.id === id) || null;
  } catch (error) {
    console.error('Error reading inquiry:', error);
    return null;
  }
}

/**
 * Create a new inquiry
 * @param {Object} data - Inquiry data
 * @returns {Promise<Object>} Created inquiry object
 */
export async function createInquiry(data) {
  await initializeLeadsFile();

  try {
    const inquiries = await readJSON(LEADS_FILE);

    const newInquiry = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'new',
      ...data
    };

    inquiries.push(newInquiry);
    await writeJSON(LEADS_FILE, inquiries);

    return newInquiry;
  } catch (error) {
    console.error('Error creating inquiry:', error);
    throw error;
  }
}

/**
 * Update an existing inquiry
 * @param {string} id - Inquiry ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object|null>} Updated inquiry object or null if not found
 */
export async function updateInquiry(id, updates) {
  await initializeLeadsFile();

  try {
    const inquiries = await readJSON(LEADS_FILE);
    const index = inquiries.findIndex(inquiry => inquiry.id === id);

    if (index === -1) {
      return null;
    }

    // Update status-specific timestamps
    if (updates.status === 'accepted' && !inquiries[index].reviewedAt) {
      updates.reviewedAt = new Date().toISOString();
    }

    if (updates.status === 'declined' && !inquiries[index].reviewedAt) {
      updates.reviewedAt = new Date().toISOString();
    }

    inquiries[index] = { ...inquiries[index], ...updates };
    await writeJSON(LEADS_FILE, inquiries);

    return inquiries[index];
  } catch (error) {
    console.error('Error updating inquiry:', error);
    throw error;
  }
}

/**
 * Delete an inquiry
 * @param {string} id - Inquiry ID
 * @returns {Promise<boolean>} True if deleted, false if not found
 */
export async function deleteInquiry(id) {
  await initializeLeadsFile();

  try {
    const inquiries = await readJSON(LEADS_FILE);
    const filteredInquiries = inquiries.filter(inquiry => inquiry.id !== id);

    if (filteredInquiries.length === inquiries.length) {
      return false; // No inquiry was found/deleted
    }

    await writeJSON(LEADS_FILE, filteredInquiries);
    return true;
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    throw error;
  }
}

/**
 * Get inquiries filtered by status
 * @param {string} status - Status to filter by
 * @returns {Promise<Array>} Array of filtered inquiry objects
 */
export async function getInquiriesByStatus(status) {
  const allInquiries = await getAllInquiries();
  return allInquiries.filter(inquiry => inquiry.status === status);
}

/**
 * Get inquiry statistics
 * @returns {Promise<Object>} Object with counts for each status
 */
export async function getInquiryStats() {
  const allInquiries = await getAllInquiries();

  return {
    total: allInquiries.length,
    new: allInquiries.filter(inquiry => inquiry.status === 'new').length,
    accepted: allInquiries.filter(inquiry => inquiry.status === 'accepted').length,
    declined: allInquiries.filter(inquiry => inquiry.status === 'declined').length
  };
} 