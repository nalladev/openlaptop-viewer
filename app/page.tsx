"use client"

import { useState, useEffect } from "react"
import ModelViewer from "@/components/model-viewer"
import TabNavigation from "@/components/tab-navigation"
import ModelMetadata from "@/components/model-metadata"
import Link from "next/link"

interface ModelData {
  id: string
  project: "virgo" | "anyon_e"
  filename: string
  url: string
  sourceRepo: string
  commitSha: string
  publishedAt: string
  status: "success" | "failed"
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"virgo" | "anyon_e">("virgo")
  const [models, setModels] = useState<ModelData[]>([])
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/models/manifest.json")
        if (response.ok) {
          const manifest = await response.json()
          setModels(manifest.models || [])
          // Set first model as default
          const firstModel = (manifest.models || []).find((m) => m.project === activeTab && m.status === "success")
          if (firstModel) {
            setSelectedModel(firstModel)
          }
        }
      } catch (error) {
        console.error("Failed to load manifest:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [activeTab])

  const tabModels = models.filter((m) => m.project === activeTab)
  const activeModel =
    selectedModel?.project === activeTab ? selectedModel : tabModels.find((m) => m.status === "success")

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">OpenLaptop Viewer</h1>
            <p className="text-slate-300">Interactive 3D models of open-source laptop hardware</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
          >
            Admin
          </Link>
        </header>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="bg-slate-800 rounded-lg h-96 flex items-center justify-center">
                <p className="text-slate-300">Loading models...</p>
              </div>
            ) : activeModel ? (
              <ModelViewer model={activeModel} />
            ) : (
              <div className="bg-slate-800 rounded-lg h-96 flex items-center justify-center">
                <p className="text-slate-300">No model found — try manual run</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Available Models</h2>
              <div className="space-y-2">
                {tabModels.length === 0 ? (
                  <p className="text-slate-400 text-sm">No models available</p>
                ) : (
                  tabModels.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeModel?.id === model.id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                      }`}
                    >
                      <div className="font-medium">{model.filename}</div>
                      <div className={`text-xs ${model.status === "success" ? "text-green-300" : "text-red-300"}`}>
                        {model.status}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {activeModel && <ModelMetadata model={activeModel} />}
          </div>
        </div>
      </div>
    </main>
  )
}
