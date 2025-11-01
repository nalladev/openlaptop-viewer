"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

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

function SimpleCube() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  )
}

interface ModelViewerProps {
  model: ModelData
}

export default function ModelViewer({ model }: ModelViewerProps) {
  if (model.status === "failed") {
    return (
      <div className="bg-slate-800 rounded-lg h-96 flex items-center justify-center">
        <p className="text-red-300">Model failed to convert</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <div className="h-96 relative bg-slate-900">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-slate-300">Loading...</p>
            </div>
          }
        >
          <Canvas camera={{ position: [3, 3, 3], fov: 50 }} style={{ width: "100%", height: "100%" }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <SimpleCube />
            <OrbitControls />
          </Canvas>
        </Suspense>
      </div>
      <div className="p-4 bg-slate-900 flex gap-2">
        <a
          href={model.sourceRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          View Repository
        </a>
      </div>
    </div>
  )
}
