import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);

/**
 * Check if an email is in the admin allowlist
 * @param {string} email - Email to check
 * @returns {boolean} True if email is admin
 */
export function isAdminEmail(email) {
  if (!email) return false;
  
  const adminEmails = process.env.ADMIN_EMAILS;
  if (!adminEmails) return false;
  
  const allowedEmails = adminEmails.split(',').map(e => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase());
}

/**
 * Verify admin credentials against environment variables
 * @param {string} username - Username to verify
 * @param {string} password - Password to verify
 * @returns {boolean} True if credentials are valid
 */
export function verifyCredentials(username, password) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  
  return username === expectedUsername && password === expectedPassword;
}

/**
 * Create a session token for the user
 * @param {Object} payload - User data to include in token
 * @returns {Promise<string>} JWT token
 */
export async function signSession(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

/**
 * Verify a session token
 * @param {string} token - Session token to verify
 * @returns {Promise<Object|null>} User data if valid, null if invalid
 */
export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

/**
 * Serialize a cookie with options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options
 * @returns {string} Serialized cookie string
 */
export function cookieSerialize(name, value, options = {}) {
  const {
    maxAge,
    path = '/',
    sameSite = 'Lax',
    httpOnly = true,
    secure = process.env.NODE_ENV === 'production'
  } = options;
  
  const parts = [`${name}=${value}`];
  
  if (maxAge) parts.push(`Max-Age=${maxAge}`);
  if (path) parts.push(`Path=${path}`);
  if (sameSite) parts.push(`SameSite=${sameSite}`);
  if (httpOnly) parts.push('HttpOnly');
  if (secure) parts.push('Secure');
  
  return parts.join('; ');
}

/**
 * Get a cookie value from request headers
 * @param {Request} req - Next.js request object
 * @param {string} name - Cookie name
 * @returns {string|undefined} Cookie value
 */
export function getCookie(req, name) {
  const cookies = req.headers?.get?.('cookie') || req.headers?.cookie || '';
  const cookie = cookies.split(';').find(c => c.trim().startsWith(`${name}=`));
  return cookie?.split('=')[1];
}

/**
 * Get user from request using session cookie
 * @param {Request} req - Next.js request object
 * @returns {Promise<Object|null>} User data if valid, null if invalid
 */
export async function getUserFromRequest(req) {
  const token = getCookie(req, 'session');
  if (!token) return null;
  
  return await verifySession(token);
}

/**
 * Require admin authentication for Edge runtime
 * @param {Request} req - Next.js request object
 * @returns {Promise<Object|null>} User data if authenticated, null if not
 */
export async function requireAdminEdge(req) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return null;
  }
  return user;
}

/**
 * Require admin authentication for Node.js runtime
 * @param {Request} req - Next.js request object
 * @returns {Promise<Object>} User data if authenticated
 * @throws {Error} If not authenticated
 */
export async function requireAdminNode(req) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return user;
} 