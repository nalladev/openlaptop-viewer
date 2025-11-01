"use client"

import type React from "react"
import { useState } from "react"

export default function AdminContent() {
  const [token, setToken] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (response.ok) {
        setAuthenticated(true)
        setMessage("")
      } else {
        setMessage("Invalid admin token")
      }
    } catch (error) {
      setMessage("Error verifying token")
    }
    setToken("")
  }

  const triggerWorkflow = async () => {
    setLoading(true)
    setMessage("")
    setLogs([])

    try {
      setLogs((prev) => [...prev, "[" + new Date().toLocaleTimeString() + "] Triggering workflow dispatch..."])

      const response = await fetch("/api/admin/trigger-workflow", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setLogs((prev) => [...prev, "[" + new Date().toLocaleTimeString() + "] " + data.message])
        setMessage("Workflow dispatch sent successfully")
      } else {
        const error = await response.json()
        setLogs((prev) => [...prev, "[" + new Date().toLocaleTimeString() + "] Error: " + error.error])
        setMessage("Failed to trigger workflow. Check that GITHUB_TOKEN is set.")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      setLogs((prev) => [...prev, "[" + new Date().toLocaleTimeString() + "] Error: " + errorMsg])
      setMessage("Error triggering workflow")
    } finally {
      setLoading(false)
    }
  }

  const refreshManifest = async () => {
    setLoading(true)
    setMessage("")
    try {
      setLogs((prev) => [...prev, "[" + new Date().toLocaleTimeString() + "] Refreshing manifest..."])

      const response = await fetch("/api/refresh", {
        method: "POST",
      })

      if (response.ok) {
        setLogs((prev) => [...prev, "[" + new Date().toLocaleTimeString() + "] Manifest refreshed successfully"])
        setMessage("Manifest refreshed")
      } else {
        setLogs((prev) => [...prev, "[" + new Date().toLocaleTimeString() + "] Error refreshing manifest"])
        setMessage("Failed to refresh manifest")
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error"
      setLogs((prev) => [...prev, "[" + new Date().toLocaleTimeString() + "] Error: " + errorMsg])
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                placeholder="Enter admin token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 border border-slate-600 focus:outline-none focus:border-blue-500"
              />
              {message && <p className="text-red-400 text-sm mt-2">{message}</p>}
              <button
                type="submit"
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Login
              </button>
            </form>
            <p className="text-slate-400 text-xs mt-6 text-center">Admin token is set via ADMIN_TOKEN</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <button
              onClick={() => setAuthenticated(false)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
            >
              Logout
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Workflow Controls</h2>
              <div className="space-y-3">
                <button
                  onClick={triggerWorkflow}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Dispatching..." : "Trigger CAD Conversion Workflow"}
                </button>
                <button
                  onClick={refreshManifest}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Refreshing..." : "Refresh Manifest Cache"}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.includes("success") || message.includes("successfully")
                    ? "bg-green-900 text-green-200"
                    : "bg-yellow-900 text-yellow-200"
                }`}
              >
                {message}
              </div>
            )}

            {logs.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Activity Log</h3>
                <div className="bg-slate-900 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm text-slate-300 space-y-1">
                  {logs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Configuration</h3>
              <div className="text-xs text-slate-400 space-y-1">
                <p className="text-yellow-300">
                  Note: Update the repo URL in the trigger function with your actual repository.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
