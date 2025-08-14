import { getServerSession } from 'next-auth/next';

/**
 * Require admin authentication using NextAuth
 * @param {Request} req - Next.js request object
 * @returns {Promise<Object>} User data if authenticated
 * @throws {Error} If not authenticated
 */
export async function requireAdminAuth(req) {
  const session = await getServerSession(req);
  
  if (!session || !session.user || !session.user.email) {
    throw new Error('Unauthorized');
  }
  
  // Check if user email is in admin allowlist
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) {
    console.warn('ADMIN_EMAILS environment variable not configured');
    throw new Error('Unauthorized');
  }
  
  const allowedEmails = adminEmails.split(',').map(email => email.trim().toLowerCase());
  if (!allowedEmails.includes(session.user.email.toLowerCase())) {
    console.warn(`Access denied for email: ${session.user.email}`);
    throw new Error('Unauthorized');
  }
  
  return session.user;
}

/**
 * Get current user session (optional)
 * @param {Request} req - Next.js request object
 * @returns {Promise<Object|null>} User data if authenticated, null if not
 */
export async function getCurrentUser(req) {
  try {
    return await requireAdminAuth(req);
  } catch (error) {
    return null;
  }
} 