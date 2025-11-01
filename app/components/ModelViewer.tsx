'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Box } from '@react-three/drei'
import { useState, Suspense } from 'react'

interface ModelProps {
  url: string
  exploded: boolean
}

function ModelContent({ url, exploded }: ModelProps) {
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
}

function FallbackModel({ message }: { message: string }) {
  return (
    <group>
      <Box args={[2, 1, 3]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#666666" />
      </Box>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
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
        <meshStandardMaterial color="#333333" />
      </Box>
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Loading...
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

  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setExploded(!exploded)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {exploded ? 'Assembly View' : 'Exploded View'}
        </button>
      </div>
      
      <Canvas
        camera={{ position: [5, 5, 5], fov: 50 }}
        style={{ background: '#1a1a1a' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={<LoadingFallback />}>
          {modelUrl ? (
            <ModelContent url={modelUrl} exploded={exploded} />
          ) : (
            <FallbackModel message="No model available" />
          )}
        </Suspense>
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI}
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>
    </div>
  )
}

// Preload models when they become available
useGLTF.preload('/models/sample.glb')
