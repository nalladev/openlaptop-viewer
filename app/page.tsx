"use client"

import { useState, useEffect } from "react"
import ModelViewer from "./components/ModelViewer"

interface ModelInfo {
  id: string
  name: string
  description: string
  file: string
  category: "component" | "module" | "assembly"
}

interface RepositoryInfo {
  name: string
  description: string
  repository: string
  models: ModelInfo[]
}

interface Manifest {
  lastUpdated: string
  repositories: {
    virgo: RepositoryInfo
    anyon_e: RepositoryInfo
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"virgo" | "anyon_e">("virgo")
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [triggering, setTriggering] = useState(false)

  useEffect(() => {
    fetchManifest()
  }, [])

  useEffect(() => {
    // Auto-select first available model when tab changes
    if (manifest && manifest.repositories[activeTab]?.models.length > 0) {
      setSelectedModelId(manifest.repositories[activeTab].models[0].id)
    }
  }, [activeTab, manifest])

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
      
      // Auto-select first model if none selected
      if (!selectedModelId && data.repositories[activeTab]?.models.length > 0) {
        setSelectedModelId(data.repositories[activeTab].models[0].id)
      }
    } catch (err) {
      console.error("Error loading manifest:", err)
      setError(err instanceof Error ? err.message : "Failed to load models")
    } finally {
      setLoading(false)
    }
  }

  const getCurrentModel = (): ModelInfo | null => {
    if (!manifest || !selectedModelId) return null
    const repo = manifest.repositories[activeTab]
    return repo?.models.find(m => m.id === selectedModelId) || null
  }

  const getCurrentModelUrl = (): string | undefined => {
    const model = getCurrentModel()
    if (!model) return undefined
    return `/models/${activeTab}/${model.file}`
  }

  const triggerWorkflow = async () => {
    try {
      setTriggering(true)
      // Since we're on a static site, direct users to GitHub Actions
      const repoUrl = "https://github.com/yourusername/openlaptop-viewer"
      const actionsUrl = `${repoUrl}/actions/workflows/convert-and-publish.yml`
      
      alert(`Please visit GitHub Actions to manually trigger the workflow:\n\n${actionsUrl}\n\nClick "Run workflow" to start the conversion process.`)
      
      // Open the GitHub Actions page
      window.open(actionsUrl, '_blank')
    } catch (err) {
      console.error("Error opening workflow page:", err)
      alert("Please visit your GitHub repository and go to Actions > Convert and Publish CAD Files > Run workflow")
    } finally {
      setTriggering(false)
    }
  }

  const currentModel = getCurrentModel()
  const currentRepo = manifest?.repositories[activeTab]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-white">OpenLaptop Viewer</h1>
              <p className="text-sm text-gray-400">3D visualization of open source laptop designs</p>
            </div>
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
                {triggering ? "Opening GitHub..." : "Update Models"}
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
              <div className="flex flex-col items-start">
                <span>System76 Virgo</span>
                <span className="text-xs text-gray-500">Open Source Laptop</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("anyon_e")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "anyon_e"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <div className="flex flex-col items-start">
                <span>ANYON_E</span>
                <span className="text-xs text-gray-500">ARM Laptop by Byrantech</span>
              </div>
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
            <p className="font-medium">No models found.</p>
            <p className="text-sm">
              Click &quot;Update Models&quot; to open GitHub Actions and run the conversion workflow.
            </p>
          </div>
        )}

        {currentRepo && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{currentRepo.name}</h2>
            <p className="text-gray-400 mb-2">{currentRepo.description}</p>
            <a
              href={currentRepo.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              View on GitHub →
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Model Selection Sidebar */}
          {currentRepo && currentRepo.models.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Components</h3>
                <div className="space-y-2">
                  {currentRepo.models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModelId(model.id)}
                      className={`w-full text-left p-3 rounded transition-colors ${
                        selectedModelId === model.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      <div className="font-medium text-sm">{model.name}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {model.category} • {model.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3D Viewer */}
          <div className={currentRepo && currentRepo.models.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {currentModel ? currentModel.name : "3D Model Viewer"}
                </h2>
                {currentModel && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    currentModel.category === "module" 
                      ? "bg-green-600 text-green-100"
                      : currentModel.category === "assembly"
                      ? "bg-purple-600 text-purple-100" 
                      : "bg-blue-600 text-blue-100"
                  }`}>
                    {currentModel.category}
                  </span>
                )}
              </div>

              <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
                {currentModel ? (
                  <ModelViewer
                    modelUrl={getCurrentModelUrl()}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-4">📦</div>
                      <p className="text-lg mb-2">No Model Selected</p>
                      <p className="text-sm">
                        {currentRepo?.models.length === 0 
                          ? "No models available. Click 'Update Models' to convert CAD files."
                          : "Select a component from the sidebar to view its 3D model."
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {currentModel && (
                <div className="mt-4 p-4 bg-gray-700 rounded">
                  <p className="text-sm text-gray-300">{currentModel.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Model Info Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Model Information</h3>

              {currentModel ? (
                <div className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-400">Name</dt>
                    <dd className="text-sm text-white">{currentModel.name}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-400">Category</dt>
                    <dd className="text-sm text-white capitalize">{currentModel.category}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-400">Model File</dt>
                    <dd className="text-sm text-white font-mono">{currentModel.file}</dd>
                  </div>

                  {manifest && (
                    <div>
                      <dt className="text-sm font-medium text-gray-400">Last Updated</dt>
                      <dd className="text-sm text-white">
                        {new Date(manifest.lastUpdated).toLocaleString()}
                      </dd>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">
                  Select a model to view detailed information.
                </p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Controls</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p><strong>Left Click:</strong> Rotate model</p>
                <p><strong>Right Click:</strong> Pan view</p>
                <p><strong>Scroll:</strong> Zoom in/out</p>
                <p><strong>Double Click:</strong> Reset view</p>
              </div>
            </div>

            {manifest && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Repository Stats</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(manifest.repositories).map(([key, repo]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-400">{repo.name}:</span>
                      <span className="text-white">{repo.models.length} models</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>This viewer displays 3D models from open source laptop designs.</p>
                <p>Models are automatically converted from CAD files (STEP, STL, OBJ) to GLB format for web viewing.</p>
                <p>Click "Update Models" to refresh from the latest repository commits.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}