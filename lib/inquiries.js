import { getLeads, setLeads } from './store.js';

export async function getAllInquiries() {
  try {
    const data = await getLeads();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading inquiries:', error);
    return [];
  }
}

export async function getInquiryById(id) {
  try {
    const inquiries = await getAllInquiries();
    return inquiries.find(inquiry => inquiry.id === id) || null;
  } catch (error) {
    console.error('Error getting inquiry by ID:', error);
    return null;
  }
}

export async function createInquiry(input) {
  try {
    console.log('createInquiry - Input received:', input);
    
    const inquiries = await getAllInquiries();
    console.log('createInquiry - Current inquiries count:', inquiries.length);
    
    const newInquiry = {
      ...input,
      id: input.id || `inquiry-${Date.now()}`,
      status: input.status || 'new',
      updatedAt: input.updatedAt || new Date().toISOString(),
      createdAt: input.createdAt || new Date().toISOString()
    };
    
    console.log('createInquiry - New inquiry object:', newInquiry);
    
    inquiries.push(newInquiry);
    console.log('createInquiry - Inquiries array after push:', inquiries.length);
    
    await setLeads(inquiries);
    console.log('createInquiry - Inquiry written to store successfully');
    
    return newInquiry;
  } catch (error) {
    console.error('createInquiry - Error:', error);
    throw new Error(`Failed to create inquiry: ${error.message}`);
  }
}

export async function updateInquiry(id, patch) {
  try {
    const inquiries = await getAllInquiries();
    const index = inquiries.findIndex(inquiry => inquiry.id === id);
    
    if (index === -1) {
      throw new Error('Inquiry not found');
    }
    
    inquiries[index] = {
      ...inquiries[index],
      ...patch,
      updatedAt: new Date().toISOString()
    };
    
    await setLeads(inquiries);
    
    return inquiries[index];
  } catch (error) {
    console.error('Error updating inquiry:', error);
    throw new Error(`Failed to update inquiry: ${error.message}`);
  }
}

export async function deleteInquiry(id) {
  try {
    const inquiries = await getAllInquiries();
    const filteredInquiries = inquiries.filter(inquiry => inquiry.id !== id);
    
    if (filteredInquiries.length === inquiries.length) {
      throw new Error('Inquiry not found');
    }
    
    await setLeads(filteredInquiries);
    
    return { ok: true };
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    throw new Error(`Failed to delete inquiry: ${error.message}`);
  }
}

/**
 * Get inquiries by status or search term
 * @param {string} searchTerm - Search term to filter by
 * @param {string} status - Status to filter by
 * @returns {Promise<Array>} Array of filtered inquiry objects
 */
export async function searchInquiries(searchTerm, status) {
  const allInquiries = await getAllInquiries();
  
  let filtered = allInquiries;
  
  if (status) {
    filtered = filtered.filter(inquiry => inquiry.status === status);
  }
  
  if (!searchTerm) return filtered;

  const term = searchTerm.toLowerCase();
  return filtered.filter(inquiry =>
    inquiry.name?.toLowerCase().includes(term) ||
    inquiry.email?.toLowerCase().includes(term) ||
    inquiry.message?.toLowerCase().includes(term) ||
    inquiry.projectType?.toLowerCase().includes(term)
  );
} 