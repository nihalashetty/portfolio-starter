import { StrictMode, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import Room from './Room'

export default function App() {
  return (
    <StrictMode>
      <Leva />
      <Canvas camera={{ fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Room />
        </Suspense>
      </Canvas>
    </StrictMode>
  )
}

// This component wraps children in a group with a click handler
// Clicking any object will refresh and fit bounds

