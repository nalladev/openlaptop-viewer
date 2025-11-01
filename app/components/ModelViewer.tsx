'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Box } from '@react-three/drei'
import { useState, Suspense, Component, ReactNode } from 'react'

interface ModelProps {
  url: string
  exploded: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; onError?: (error: Error) => void },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; onError?: (error: Error) => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('3D Model Error:', error)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return <FallbackModel message="Failed to load 3D model" />
    }

    return this.props.children
  }
}

function ModelContent({ url, exploded }: ModelProps) {
  try {
    const { scene } = useGLTF(url)
    
    // Clone the scene to avoid modifying the original
    const clonedScene = scene.clone()
    
    // Apply exploded effect
    if (exploded && clonedScene.children.length > 1) {
      clonedScene.children.forEach((child, index) => {
        if (child.type === 'Mesh' || child.type === 'Group') {
          const offset = (index - clonedScene.children.length / 2) * 2
          child.position.x += offset
          child.position.y += offset * 0.5
          child.position.z += offset * 0.3
        }
      })
    }
    
    return <primitive object={clonedScene} />
  } catch (error) {
    console.error('Error loading 3D model:', error)
    return <FallbackModel message="Failed to load model" />
  }
}

function FallbackModel({ message }: { message: string }) {
  return (
    <group>
      {/* Laptop base */}
      <Box args={[2, 1, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4a5568" />
      </Box>
      {/* Laptop screen */}
      <Box args={[1.8, 0.1, 2.2]} position={[0, -1.2, 0.6]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.25}
        color="#e2e8f0"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {message}
      </Text>
    </group>
  )
}

function LoadingFallback() {
  return (
    <group>
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#4a5568" opacity={0.7} transparent />
      </Box>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.2}
        color="#cbd5e0"
        anchorX="center"
        anchorY="middle"
      >
        Loading 3D Model...
      </Text>
    </group>
  )
}

interface ModelViewerProps {
  modelUrl?: string
  className?: string
}

export default function ModelViewer({ modelUrl, className = '' }: ModelViewerProps) {
  const [exploded, setExploded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const handleModelError = (error: Error) => {
    setIsLoading(false)
    setLoadError(error.message)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {modelUrl && (
          <button
            onClick={() => setExploded(!exploded)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-lg"
            disabled={!modelUrl}
          >
            {exploded ? 'Assembly View' : 'Exploded View'}
          </button>
        )}
        
        {loadError && (
          <div className="bg-red-600 text-white px-3 py-2 rounded text-xs max-w-48">
            Model load failed
          </div>
        )}
        
        {isLoading && (
          <div className="bg-gray-600 text-white px-3 py-2 rounded text-xs">
            Loading...
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="text-xs text-gray-300 bg-black bg-opacity-50 px-2 py-1 rounded">
          {modelUrl ? (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              Model loaded
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              No model
            </span>
          )}
        </div>
      </div>
      
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)' }}
        onCreated={() => setIsLoading(true)}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        <pointLight position={[0, 10, 0]} intensity={0.2} color="#ffffff" />
        
        <ModelErrorBoundary onError={handleModelError}>
          <Suspense fallback={<LoadingFallback />}>
            {modelUrl ? (
              <ModelContent 
                url={modelUrl} 
                exploded={exploded}
              />
            ) : (
              <FallbackModel message="Select a component to view its 3D model" />
            )}
          </Suspense>
        </ModelErrorBoundary>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI}
          minDistance={1}
          maxDistance={50}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading 3D model...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Preload hook for better performance
export function usePreloadModel(url?: string) {
  if (url) {
    useGLTF.preload(url)
  }
}