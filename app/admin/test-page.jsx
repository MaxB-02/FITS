export default function AdminTestPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Test Page</h1>
            <p className="text-muted-foreground">
              This is a test page to verify the admin layout works.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Card 1</h2>
          <p>This page should render without any data fetching.</p>
        </div>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Card 2</h2>
          <p>If you can see this, the admin layout is working.</p>
        </div>
      </div>
    </div>
  );
}
