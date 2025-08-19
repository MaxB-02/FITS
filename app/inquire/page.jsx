import Link from 'next/link';
import { InquiryForm } from '@/components/inquiry-form.jsx';

export default function InquirePage({ searchParams }) {
  const templateId = searchParams.template;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Tell me about your project.
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-300 mb-4 max-w-2xl mx-auto">
            The more detail you give, the faster I can send you a proposal.
          </p>
          
          <p className="text-lg text-zinc-400">
            Most projects start at $500
          </p>
          
          {templateId && (
            <div className="mt-4 p-4 bg-emerald-900/20 border border-emerald-700 rounded-lg">
              <p className="text-emerald-300">
                You're inquiring about template: <strong>{templateId}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Inquiry Form */}
        <div className="max-w-3xl mx-auto">
          <InquiryForm templateId={templateId} />
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