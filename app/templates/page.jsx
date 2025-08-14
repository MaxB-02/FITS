export const dynamic = 'force-dynamic';

import { getActiveTemplates } from '@/lib/templates.js';
import { TemplateCard } from '@/components/TemplateCard.jsx';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function TemplatesPage() {
  const templates = await getActiveTemplates();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Templates that save you hours.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8">
            Plug-and-play files with documentation. Customize as needed—or I'll tailor them for you.
          </p>
          <Button asChild size="lg">
            <Link href="/inquire">Get Custom Template</Link>
          </Button>
        </div>

        {/* Templates Grid */}
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">No templates available yet</h2>
            <p className="text-zinc-400 mb-8">Check back soon for new templates, or contact us for a custom solution.</p>
            <Button asChild>
              <Link href="/inquire">Request Custom Template</Link>
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Need something custom?
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            I can create a template specifically for your workflow and business needs.
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