import { ensureDataPersistence } from '@/lib/init-production-data.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    console.log('🔄 Ensuring data persistence...');
    
    await ensureDataPersistence();
    
    console.log('✅ Data persistence completed successfully');
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data persistence ensured' 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('❌ Error ensuring data persistence:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to ensure data persistence',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
