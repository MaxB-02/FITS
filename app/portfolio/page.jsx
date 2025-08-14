export const dynamic = 'force-dynamic';

import { getActiveProjects } from '@/lib/portfolio.js';
import PortfolioCard from '@/components/PortfolioCard.jsx';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function PortfolioPage() {
  const projects = await getActiveProjects();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Portfolio of completed projects.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8">
            See examples of custom solutions I've built for clients.
          </p>
          <Button asChild size="lg">
            <Link href="/inquire">Start Your Project</Link>
          </Button>
        </div>

        {/* Portfolio Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project) => (
              <PortfolioCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">No projects yet</h2>
            <p className="text-zinc-400 mb-8">Check back soon for completed project examples.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start your project?
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            I can create a custom solution specifically for your workflow and business needs.
          </p>
          <Button asChild size="lg">
            <Link href="/inquire">Start a Project</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-zinc-400">
          <p>&copy; 2024 Freak in the Sheets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 