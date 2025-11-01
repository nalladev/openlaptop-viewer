import AdminContent from "@/components/admin-content"

export default async function AdminPage() {
  const token = process.env.ADMIN_TOKEN

  // If no token is configured, show error message
  if (!token) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-white mb-6">Configuration Error</h1>
            <p className="text-slate-300">
              Admin token is not configured. Please set ADMIN_TOKEN in your environment variables.
            </p>
          </div>
        </div>
      </main>
    )
  }

  return <AdminContent />
}
