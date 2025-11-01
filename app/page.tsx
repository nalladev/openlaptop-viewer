"use client"

import { useState, useEffect } from "react"
import ModelViewer from "@/components/model-viewer"

interface ModelData {
  id: string
  project: "virgo" | "anyon_e"
  filename: string
  url: string
  sourceRepo: string
  commitSha: string
  publishedAt: string
  status: "success" | "failed" | "pending"
}

interface Manifest {
  lastUpdated: string
  models: {
    [key: string]: ModelData[]
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"virgo" | "anyon_e">("virgo")
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [triggering, setTriggering] = useState(false)

  useEffect(() => {
    fetchManifest()
  }, [])

  const fetchManifest = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/models/manifest.json", {
        cache: "no-cache",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status}`)
      }

      const data = (await response.json()) as Manifest
      setManifest(data)
    } catch (err) {
      console.error("Error loading manifest:", err)
      setError(err instanceof Error ? err.message : "Failed to load models")
    } finally {
      setLoading(false)
    }
  }

  const getCurrentModel = (): ModelData | null => {
    if (!manifest) return null
    const models = manifest.models[activeTab] || []
    return models.find((m) => m.status === "success") || models[0] || null
  }

  const triggerWorkflow = async () => {
    try {
      setTriggering(true)
      const response = await fetch("/api/trigger-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (response.ok) {
        alert("Workflow triggered successfully! Check the Actions tab in GitHub.")
      } else {
        console.error("Workflow trigger failed:", result)
        alert(`Failed to trigger workflow: ${result.error || "Unknown error"}`)
      }
    } catch (err) {
      console.error("Error triggering workflow:", err)
      alert("Error triggering workflow. Check console for details.")
    } finally {
      setTriggering(false)
    }
  }

  const currentModel = getCurrentModel()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-white">OpenLaptop Viewer</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchManifest}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
              <button
                onClick={triggerWorkflow}
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm transition-colors disabled:opacity-50"
                disabled={triggering}
              >
                {triggering ? "Triggering..." : "Convert Models"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("virgo")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "virgo"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              System76 Virgo
            </button>
            <button
              onClick={() => setActiveTab("anyon_e")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "anyon_e"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Framework anyon_e
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error loading models:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && !manifest && (
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded mb-6">
            <p className="font-medium">No manifest found.</p>
            <p className="text-sm">
              Click &quot;Convert Models&quot; to run the workflow and generate 3D
              models.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {activeTab === "virgo" ? "System76 Virgo" : "Framework anyon_e"} 3D
                Model
              </h2>

              <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
                <ModelViewer
                  modelUrl={
                    currentModel?.status === "success" ? currentModel.url : undefined
                  }
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Model Info */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Model Information</h3>

              {currentModel ? (
                <div className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Status</dt>
                    <dd
                      className={`text-sm ${
                        currentModel.status === "success"
                          ? "text-green-400"
                          : currentModel.status === "failed"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {currentModel.status === "success"
                        ? "✓ Model loaded"
                        : currentModel.status === "failed"
                        ? "✗ Conversion failed"
                        : "⏳ Processing"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-400">Source Repository</dt>
                    <dd className="text-sm">
                      <a
                        href={`https://github.com/${currentModel.sourceRepo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {currentModel.sourceRepo}
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-400">Last Commit</dt>
                    <dd className="text-sm">
                      <a
                        href={`https://github.com/${currentModel.sourceRepo}/commit/${currentModel.commitSha}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-mono transition-colors"
                      >
                        {currentModel.commitSha.substring(0, 8)}
                      </a>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-400">Last Updated</dt>
                    <dd className="text-sm text-gray-300">
                      {new Date(currentModel.timestamp).toLocaleString()}
                    </dd>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  No model data available. Run the workflow to convert CAD files.
                </p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>1. Click &quot;Convert Models&quot; to fetch and convert CAD files</p>
                <p>2. Wait for the GitHub Action workflow to complete</p>
                <p>3. Refresh the page to see converted 3D models</p>
                <p>4. Use mouse to rotate, zoom, and pan the model</p>
                <p>5. Toggle &quot;Exploded View&quot; to see component separation</p>
              </div>
            </div>

            {manifest && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Available Models</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(manifest.models).map(([project, models]) => (
                    <div key={project}>
                      <span className="font-medium capitalize">{project}:</span>
                      <span className="ml-2 text-gray-400">
                        {models.length} model{models.length !== 1 ? "s" : ""}
                        {models.length > 0 &&
                          ` (${models.filter((m) => m.status === "success").length} ready)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
