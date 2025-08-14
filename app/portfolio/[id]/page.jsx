export const dynamic = 'force-dynamic';

import { getActiveProjects, getProjectById } from '@/lib/portfolio.js';
import PortfolioDetail from '@/components/PortfolioDetail.jsx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function PortfolioProjectPage({ params }) {
  const project = await getProjectById(params.id);
  
  // Check if project exists and is active
  if (!project || !project.active) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/portfolio" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
            ← Back to Portfolio
          </Link>
        </div>
        
        <PortfolioDetail project={project} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-zinc-400">
          <p>© 2024 Freak in the Sheets. All rights reserved.</p>
        </div>
      </footer>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": project.title,
            "description": project.shortDesc,
            "image": project.cover,
            "category": "Software Application",
            "creator": {
              "@type": "Organization",
              "name": "Freak in the Sheets"
            }
          })
        }}
      />
    </div>
  );
} 