'use client'

import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Sparkles } from '@react-three/drei'

/** Akışkan-bozulan, metalik/iridescent ikosahedron. animated=false → statik (reduced-motion). */
function Blob({ animated }: { animated: boolean }) {
  return (
    <Float
      speed={animated ? 1.4 : 0}
      rotationIntensity={animated ? 0.6 : 0}
      floatIntensity={animated ? 1.2 : 0}
    >
      <mesh scale={2.4}>
        <icosahedronGeometry args={[1, 20]} />
        <MeshDistortMaterial
          color="#2563eb"
          distort={0.42}
          speed={animated ? 1.6 : 0}
          roughness={0.08}
          metalness={0.95}
        />
      </mesh>
    </Float>
  )
}

/**
 * Hero WebGL sahnesi — kendi içinde (ağ bağımlılığı yok), lazy yüklenir.
 * animated=false → sahne statik (autorotate/float/distort kapalı) ama render döngüsü
 * açık kalır (canvas güvenilir boyutlanır). Reduced-motion'da algılanan hareket olmaz.
 */
export default function Scene3D({ animated = true }: { animated?: boolean }) {
  // r3f canvas, dinamik import sonrası bazen ilk ölçümde 300x150'de takılır.
  // Mount'ta bir resize tetikleyerek konteyner boyutuna oturmasını garanti et.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'))
    const raf = requestAnimationFrame(fire)
    const t = setTimeout(fire, 200)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [])

  return (
    <Canvas
      frameloop={animated ? 'always' : 'demand'}
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <pointLight position={[-6, -2, 3]} intensity={120} color="#8b5cf6" />
      <pointLight position={[6, 4, 5]} intensity={90} color="#22d3ee" />
      <Blob animated={animated} />
      {animated && <Sparkles count={70} scale={12} size={2.4} speed={0.3} opacity={0.5} color="#93c5fd" />}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={animated} autoRotateSpeed={0.7} />
    </Canvas>
  )
}
