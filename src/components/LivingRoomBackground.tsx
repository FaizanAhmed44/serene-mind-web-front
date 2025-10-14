import React from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';

const LivingRoomBackground: React.FC = () => {
  const texture = useLoader(TextureLoader, '/assets/living_room.jpg'); // Place image in public/assets/images/
  const { viewport } = useThree();

  // Image dimensions (same as original)
  const imageWidth = 599;
  const imageHeight = 532;
  const imageAspectRatio = imageWidth / imageHeight;

  // Calculate dimensions based on viewport
  const height = 10; // Fixed height value
  const width = height * (viewport.aspect / imageAspectRatio);

  return (
    <mesh
      position={[0, -10, -12]}  // Position further back
      renderOrder={-1}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial 
        map={texture} 
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
};

export default LivingRoomBackground;