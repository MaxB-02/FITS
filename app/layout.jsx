import './globals.css';
import { Inter } from 'next/font/google';
import SiteHeader from '@/components/site-header.jsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Freak in the Sheets',
  description: 'Custom automation & dashboards tailored to your workflow.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
} 