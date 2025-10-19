import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

// Avatar Model Component
interface AvatarModelProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}

function AvatarModel({ position = [0, -0.5, 0], scale = 0.8, rotation = [0, 0, 0] }: AvatarModelProps) {
  const { scene } = useGLTF('/character-transformed.glb');
  return <primitive object={scene} position={position} scale={scale} rotation={rotation} />;
}

// Preload the model
useGLTF.preload('/character-transformed.glb');

// Loading fallback component
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#8b5cf6" />
    </mesh>
  );
}

// Main Avatar3D Component
interface Avatar3DProps {
  width?: number;
  height?: number;
  isAnimating?: boolean;
  className?: string;
}

const Avatar3D: React.FC<Avatar3DProps> = ({ 
  width = 200, 
  height = 200, 
  isAnimating = false,
  className = ""
}) => {
  return (
    <div 
      className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Simplified Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        
        {/* 3D Model with Suspense */}
        <Suspense fallback={<Loader />}>
          <AvatarModel 
            position={[0, -0.5, 0]}
            scale={0.8}
            rotation={[0, 0, 0]}
          />
        </Suspense>
        
        {/* Controls */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate={isAnimating}
          autoRotateSpeed={2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};

export default Avatar3D;