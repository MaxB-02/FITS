import { getTemplateById } from '@/lib/templates.js';
import TemplateDetail from '@/components/TemplateDetail.jsx';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function TemplatePage({ params }) {
  const template = await getTemplateById(params.id);

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/templates" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
            ← Back to Templates
          </Link>
        </div>
        
        <TemplateDetail template={template} />
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
            "@type": "Product",
            "name": template.name,
            "description": template.shortDesc,
            "offers": {
              "@type": "Offer",
              "price": template.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "image": template.cover,
            "category": "Software Application",
            "brand": {
              "@type": "Brand",
              "name": "Freak in the Sheets"
            }
          })
        }}
      />
    </div>
  );
} 