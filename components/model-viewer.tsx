"use client"

import { Suspense, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"

interface ModelData {
  id: string
  project: "virgo" | "anyon_e"
  filename: string
  url: string
  sourceRepo: string
  sourcePath?: string
  commitSha: string
  publishedAt: string
  status: "success" | "failed"
}

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}

function FallbackLaptop() {
  return (
    <group>
      {/* Keyboard base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[3, 0.3, 2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1.2, -0.8]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#2d2d2d" />
      </mesh>
      {/* Display */}
      <mesh position={[0, 1.2, -0.65]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[2.8, 1.8, 0.05]} />
        <meshStandardMaterial color="#0066ff" emissive="#0044cc" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

interface ModelViewerProps {
  model: ModelData
}

export default function ModelViewer({ model }: ModelViewerProps) {
  const [hasError, setHasError] = useState(false)

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
              <p className="text-slate-300">Loading 3D model...</p>
            </div>
          }
        >
          <Canvas camera={{ position: [5, 3, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.3} />

            {!hasError ? <LoadedModel url={model.url} /> : <FallbackLaptop />}

            <OrbitControls />
          </Canvas>
        </Suspense>
      </div>
      <div className="p-4 bg-slate-900 flex gap-2 flex-wrap">
        <a
          href={model.sourceRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          View Repository
        </a>
        <a
          href={`https://github.com/${model.sourceRepo.replace("https://github.com/", "")}/tree/main/${model.sourcePath || ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
        >
          View Source CAD
        </a>
      </div>
    </div>
  )
}
