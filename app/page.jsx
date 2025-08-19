import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Custom automation & dashboards tailored to your workflow.
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8">
            Tell me what you need, and I'll propose a fast, reliable solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              <Link href="/inquire">Start a Project</Link>
            </button>
            <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              <Link href="/templates">Browse Templates</Link>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Solutions</h3>
            <p className="text-zinc-400">Get working solutions in days, not weeks.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Reliable Results</h3>
            <p className="text-zinc-400">Built to last with proper error handling and testing.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tailored to You</h3>
            <p className="text-zinc-400">Custom solutions that fit your exact needs and workflow.</p>
          </div>
        </div>

        {/* Templates Preview Section */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready-to-use templates
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            Start with proven solutions and customize them for your business.
          </p>
          <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            <Link href="/templates">Browse Templates</Link>
          </button>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to streamline your workflow?
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            Let's discuss your project and get you started with a custom solution.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
            <Link href="/inquire">Start a Project</Link>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-32">
        <div className="container mx-auto px-4 py-8 text-center text-zinc-400">
          <p>&copy; 2024 Freak in the Sheets. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 