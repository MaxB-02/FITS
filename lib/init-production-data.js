import { promises as fs } from 'node:fs';
import path from 'node:path';

// Initialize production data files if they don't exist
export async function initializeProductionData() {
  if (process.env.NODE_ENV !== 'production') {
    return; // Only run in production
  }

  console.log('🌐 Initializing production data files...');
  
  const dataDir = process.env.DATA_DIR || '/tmp';
  const files = [
    {
      path: 'leads.json',
      defaultData: [
        {
          id: 'sample-inquiry-1',
          createdAt: new Date().toISOString(),
          name: 'Sample Customer',
          email: 'sample@example.com',
          company: 'Sample Company',
          phone: '+1-555-0123',
          services: ['Custom Dashboard', 'Workflow Automation'],
          description: 'This is a sample inquiry to demonstrate the system is working.',
          hasExistingSystem: false,
          filePath: null,
          budgetLow: 1000,
          budgetHigh: 5000,
          desiredDate: '2024-12-31',
          templateId: null,
          status: 'new'
        }
      ]
    },
    {
      path: 'templates.json',
      defaultData: [
        {
          id: 'sample-template-1',
          name: 'Sample Dashboard Template',
          price: 500,
          shortDesc: 'A sample template to demonstrate the system.',
          longDesc: 'This is a placeholder template that shows the admin dashboard is working correctly.',
          images: [],
          cover: 'https://picsum.photos/seed/template/600',
          useCases: ['Sample Use Case 1', 'Sample Use Case 2']
        }
      ]
    },
    {
      path: 'portfolio.json',
      defaultData: [
        {
          id: '1',
          title: 'Sample Portfolio Project',
          shortDesc: 'A sample portfolio item to demonstrate the system.',
          longDesc: 'This is a placeholder portfolio project that shows the admin dashboard is working correctly.',
          images: [],
          cover: 'https://picsum.photos/seed/portfolio/600',
          useCases: ['Sample Use Case 1', 'Sample Use Case 2']
        }
      ]
    }
  ];

  for (const file of files) {
    try {
      const filePath = path.join(dataDir, file.path);
      
      // Check if file exists
      try {
        await fs.access(filePath);
        console.log(`✅ ${file.path} already exists`);
      } catch (error) {
        // File doesn't exist, create it
        console.log(`📝 Creating ${file.path} with sample data`);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(file.defaultData, null, 2), 'utf8');
        console.log(`✅ Created ${file.path}`);
      }
    } catch (error) {
      console.error(`❌ Failed to initialize ${file.path}:`, error.message);
    }
  }
  
  console.log('🌐 Production data initialization complete');
}
