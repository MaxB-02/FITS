import fs from 'fs/promises';
import path from 'path';
import db from './database.js';

/**
 * Data Migration Script
 * Migrates data from old file locations to new database system
 */

export async function migrateData() {
  console.log('🔄 Starting data migration...');
  
  try {
    // Migrate inquiries/leads
    await migrateInquiries();
    
    // Migrate templates
    await migrateTemplates();
    
    // Migrate portfolio
    await migratePortfolio();
    
    console.log('✅ Data migration completed successfully!');
  } catch (error) {
    console.error('❌ Data migration failed:', error);
    throw error;
  }
}

async function migrateInquiries() {
  console.log('📝 Migrating inquiries...');
  
  try {
    // Try to read from old locations
    const oldLocations = [
      'data/leads.json',
      'leads.json',
      '/tmp/leads.json'
    ];
    
    let oldData = [];
    
    for (const location of oldLocations) {
      try {
        const data = await fs.readFile(location, 'utf8');
        oldData = JSON.parse(data);
        console.log(`📁 Found old data at: ${location}`);
        break;
      } catch (error) {
        // Continue to next location
      }
    }
    
    if (oldData.length > 0) {
      // Write to new location
      await db.writeData('leads.json', oldData);
      console.log(`✅ Migrated ${oldData.length} inquiries`);
    } else {
      console.log('ℹ️ No old inquiry data found to migrate');
    }
  } catch (error) {
    console.error('❌ Failed to migrate inquiries:', error);
  }
}

async function migrateTemplates() {
  console.log('📋 Migrating templates...');
  
  try {
    // Try to read from old locations
    const oldLocations = [
      'data/templates.json',
      'templates.json',
      '/tmp/templates.json'
    ];
    
    let oldData = [];
    
    for (const location of oldLocations) {
      try {
        const data = await fs.readFile(location, 'utf8');
        oldData = JSON.parse(data);
        console.log(`📁 Found old data at: ${location}`);
        break;
      } catch (error) {
        // Continue to next location
      }
    }
    
    if (oldData.length > 0) {
      // Write to new location
      await db.writeData('templates.json', oldData);
      console.log(`✅ Migrated ${oldData.length} templates`);
    } else {
      console.log('ℹ️ No old template data found to migrate');
    }
  } catch (error) {
    console.error('❌ Failed to migrate templates:', error);
  }
}

async function migratePortfolio() {
  console.log('🎨 Migrating portfolio...');
  
  try {
    // Try to read from old locations
    const oldLocations = [
      'data/portfolio.json',
      'portfolio.json',
      '/tmp/portfolio.json'
    ];
    
    let oldData = [];
    
    for (const location of oldLocations) {
      try {
        const data = await fs.readFile(location, 'utf8');
        oldData = JSON.parse(data);
        console.log(`📁 Found old data at: ${location}`);
        break;
      } catch (error) {
        // Continue to next location
      }
    }
    
    if (oldData.length > 0) {
      // Write to new location
      await db.writeData('portfolio.json', oldData);
      console.log(`✅ Migrated ${oldData.length} portfolio items`);
    } else {
      console.log('ℹ️ No old portfolio data found to migrate');
    }
  } catch (error) {
    console.error('❌ Failed to migrate portfolio:', error);
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData().catch(console.error);
}
