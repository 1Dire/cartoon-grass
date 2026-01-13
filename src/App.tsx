import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#202020' }}>
      <Canvas 
        shadows 
        camera={{ position: [5, 5, 5], fov: 45 }}
      >
        <Experience />
      </Canvas>
    </div>
  )
}

export default App