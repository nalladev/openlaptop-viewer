"use client"

import { useEffect, useState } from "react"

interface WorkflowRun {
  id: number
  name: string
  status: string
  conclusion: string | null
  created_at: string
  updated_at: string
}

export default function WorkflowStatus() {
  const [runs, setRuns] = useState<WorkflowRun[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkflowRuns = async () => {
      try {
        // Note: This would typically fetch from your GitHub API with authentication
        // For now, we'll just set it as loading
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch workflow runs:", error)
        setLoading(false)
      }
    }

    fetchWorkflowRuns()
  }, [])

  if (loading) {
    return <div className="text-slate-300">Loading workflow status...</div>
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Latest Workflow Runs</h3>
      {runs.length === 0 ? (
        <p className="text-slate-400">No workflow runs found</p>
      ) : (
        <div className="space-y-2">
          {runs.map((run) => (
            <div key={run.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div>
                <p className="text-white font-medium">{run.name}</p>
                <p className="text-sm text-slate-400">{new Date(run.created_at).toLocaleDateString()}</p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  run.conclusion === "success"
                    ? "bg-green-900 text-green-200"
                    : run.conclusion === "failure"
                      ? "bg-red-900 text-red-200"
                      : "bg-yellow-900 text-yellow-200"
                }`}
              >
                {run.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
