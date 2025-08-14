import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Log sign-in attempt
        console.log('Sign-in attempt:', {
          email: user.email,
          provider: account?.provider,
          profileId: profile?.sub
        });

        // Check if admin emails are configured
        const adminEmails = process.env.ADMIN_EMAILS;
        if (!adminEmails) {
          console.warn('ADMIN_EMAILS environment variable not configured');
          return false;
        }

        // Parse admin emails (comma-separated)
        const allowedEmails = adminEmails.split(',').map(email => email.trim().toLowerCase());
        
        // Check if user email is in allowlist
        if (!user.email || !allowedEmails.includes(user.email.toLowerCase())) {
          console.warn(`Access denied for email: ${user.email}. Allowed: ${allowedEmails.join(', ')}`);
          return false;
        }

        console.log(`Successful sign-in for authorized email: ${user.email}`);
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Redirect to admin dashboard after successful login
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/admin`;
      }
      return baseUrl;
    },
    async session({ session, token }) {
      // Add user ID to session
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add user ID to JWT token
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`User signed in: ${user.email} via ${account?.provider} (new user: ${isNewUser})`);
    },
    async signOut({ session, token }) {
      console.log(`User signed out: ${session?.user?.email}`);
    },
    async error(error) {
      console.error('NextAuth error:', error);
    },
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 