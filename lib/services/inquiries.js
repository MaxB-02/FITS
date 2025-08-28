import db from '../database.js';

/**
 * Inquiries Service
 * Handles all inquiry-related database operations
 */

export class InquiriesService {
  constructor() {
    this.filename = 'leads.json';
  }

  /**
   * Get all inquiries
   */
  async getAll() {
    try {
      const inquiries = await db.readData(this.filename, []);
      return inquiries.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error getting all inquiries:', error);
      return [];
    }
  }

  /**
   * Get inquiry by ID
   */
  async getById(id) {
    try {
      const inquiries = await this.getAll();
      return inquiries.find(inquiry => inquiry.id === id) || null;
    } catch (error) {
      console.error('Error getting inquiry by ID:', error);
      return null;
    }
  }

  /**
   * Create new inquiry
   */
  async create(inquiryData) {
    try {
      const inquiries = await this.getAll();
      
      const newInquiry = {
        id: db.generateId('inquiry'),
        createdAt: db.getTimestamp(),
        status: 'new',
        ...inquiryData
      };

      inquiries.push(newInquiry);
      await db.writeData(this.filename, inquiries);
      
      console.log('✅ Inquiry created successfully:', newInquiry.id);
      return newInquiry;
    } catch (error) {
      console.error('Error creating inquiry:', error);
      throw new Error('Failed to create inquiry');
    }
  }

  /**
   * Update inquiry
   */
  async update(id, updates) {
    try {
      const inquiries = await this.getAll();
      const index = inquiries.findIndex(inquiry => inquiry.id === id);
      
      if (index === -1) {
        throw new Error('Inquiry not found');
      }

      // Update status-specific timestamps
      if (updates.status && ['accepted', 'declined'].includes(updates.status)) {
        updates.reviewedAt = db.getTimestamp();
      }

      inquiries[index] = { 
        ...inquiries[index], 
        ...updates,
        updatedAt: db.getTimestamp()
      };

      await db.writeData(this.filename, inquiries);
      
      console.log('✅ Inquiry updated successfully:', id);
      return inquiries[index];
    } catch (error) {
      console.error('Error updating inquiry:', error);
      throw new Error('Failed to update inquiry');
    }
  }

  /**
   * Delete inquiry
   */
  async delete(id) {
    try {
      const inquiries = await this.getAll();
      const filteredInquiries = inquiries.filter(inquiry => inquiry.id !== id);
      
      if (filteredInquiries.length === inquiries.length) {
        throw new Error('Inquiry not found');
      }

      await db.writeData(this.filename, filteredInquiries);
      
      console.log('✅ Inquiry deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      throw new Error('Failed to delete inquiry');
    }
  }

  /**
   * Get inquiries by status
   */
  async getByStatus(status) {
    try {
      const inquiries = await this.getAll();
      return inquiries.filter(inquiry => inquiry.status === status);
    } catch (error) {
      console.error('Error getting inquiries by status:', error);
      return [];
    }
  }

  /**
   * Get inquiry statistics
   */
  async getStats() {
    try {
      const inquiries = await this.getAll();
      
      return {
        total: inquiries.length,
        new: inquiries.filter(inquiry => inquiry.status === 'new').length,
        accepted: inquiries.filter(inquiry => inquiry.status === 'accepted').length,
        declined: inquiries.filter(inquiry => inquiry.status === 'declined').length
      };
    } catch (error) {
      console.error('Error getting inquiry stats:', error);
      return { total: 0, new: 0, accepted: 0, declined: 0 };
    }
  }
}

// Create and export a single instance
const inquiriesService = new InquiriesService();
export default inquiriesService;
