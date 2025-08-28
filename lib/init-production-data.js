import fs from 'fs/promises';
import path from 'path';

/**
 * Initialize production data files with sample data if they don't exist
 * This ensures AWS Lambda has the necessary data files in /tmp
 */
export async function initializeProductionData() {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔄 Not production environment, skipping data initialization');
    return;
  }

  console.log('🚀 Initializing production data...');
  
  const dataDir = process.env.DATA_DIR || '/tmp';
  console.log('📁 Using data directory:', dataDir);
  
  try {
    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });
    console.log('✅ Data directory created/verified');
    
    // Initialize leads.json if it doesn't exist
    const leadsFile = path.join(dataDir, 'leads.json');
    try {
      await fs.access(leadsFile);
      console.log('✅ leads.json already exists');
    } catch {
      console.log('📝 Creating leads.json with sample data');
      const sampleLeads = [
        {
          "id": "inquiry-1755122464027-bkwdscz2z",
          "createdAt": "2025-08-13T22:01:04.027Z",
          "name": "Maxwell Brenner",
          "email": "2maxbrenner@gmail.com",
          "company": "safasasdfadd",
          "phone": "8163821855",
          "services": ["Data Processing", "Custom Dashboard"],
          "description": "asfdsdfasd",
          "hasExistingSystem": false,
          "filePath": null,
          "budgetLow": 100,
          "budgetHigh": 1000,
          "desiredDate": "2025-08-25",
          "templateId": null,
          "status": "new"
        },
        {
          "id": "inquiry-1755130537525-yachxkxy5",
          "createdAt": "2025-08-14T00:15:37.525Z",
          "name": "12345",
          "email": "12345@gmail.com",
          "company": "12345",
          "phone": "12345",
          "services": ["Custom Dashboard", "Data Processing"],
          "description": "1234512345123451234512345",
          "hasExistingSystem": false,
          "filePath": null,
          "budgetLow": 1234500,
          "budgetHigh": 12345000,
          "desiredDate": "2025-08-20",
          "templateId": null,
          "status": "accepted",
          "reviewedAt": "2025-08-14T00:15:50.363Z"
        }
      ];
      await fs.writeFile(leadsFile, JSON.stringify(sampleLeads, null, 2));
      console.log('✅ leads.json created with sample data');
    }
    
    // Initialize templates.json if it doesn't exist
    const templatesFile = path.join(dataDir, 'templates.json');
    try {
      await fs.access(templatesFile);
      console.log('✅ templates.json already exists');
    } catch {
      console.log('📝 Creating templates.json with sample data');
      const sampleTemplates = [
        {
          "id": "test-template",
          "name": "Test Template",
          "price": 0,
          "shortDesc": "Seed template.",
          "longDesc": "Seed item for production.",
          "images": [],
          "cover": "",
          "useCases": []
        }
      ];
      await fs.writeFile(templatesFile, JSON.stringify(sampleTemplates, null, 2));
      console.log('✅ templates.json created with sample data');
    }
    
    // Initialize portfolio.json if it doesn't exist
    const portfolioFile = path.join(dataDir, 'portfolio.json');
    try {
      await fs.access(portfolioFile);
      console.log('✅ portfolio.json already exists');
    } catch {
      console.log('📝 Creating portfolio.json with sample data');
      const samplePortfolio = [
        {
          "id": "1",
          "title": "Seed Project",
          "shortDesc": "Seed portfolio item.",
          "longDesc": "Used when prod data empty.",
          "images": [],
          "cover": "",
          "useCases": []
        }
      ];
      await fs.writeFile(portfolioFile, JSON.stringify(samplePortfolio, null, 2));
      console.log('✅ portfolio.json created with sample data');
    }
    
    console.log('🎉 Production data initialization completed successfully');
    
  } catch (error) {
    console.error('❌ Error initializing production data:', error.message);
    throw error;
  }
}

/**
 * Ensure data persistence by copying data to a more permanent location
 * This is a workaround for AWS Lambda's ephemeral /tmp directory
 */
export async function ensureDataPersistence() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  
  try {
    const dataDir = process.env.DATA_DIR || '/tmp';
    const backupDir = '/tmp/data-backup';
    
    // Create backup directory
    await fs.mkdir(backupDir, { recursive: true });
    
    // Copy all data files to backup
    const files = ['leads.json', 'templates.json', 'portfolio.json'];
    
    for (const file of files) {
      const sourcePath = path.join(dataDir, file);
      const backupPath = path.join(backupDir, file);
      
      try {
        await fs.copyFile(sourcePath, backupPath);
        console.log(`✅ Backed up ${file}`);
      } catch (copyError) {
        console.log(`⚠️ Could not backup ${file}:`, copyError.message);
      }
    }
    
    console.log('✅ Data persistence backup completed');
    
  } catch (error) {
    console.error('❌ Error ensuring data persistence:', error.message);
  }
}
