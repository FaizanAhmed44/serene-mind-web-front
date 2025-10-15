import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SoothingBackground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, -40]} // far behind the character
      renderOrder={-10}
    >
      {/* Large plane covering full view */}
      <planeGeometry args={[100, 80]} />

      <shaderMaterial
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec2 vUv;

          // Random sparkle generator
          float sparkle(vec2 uv, float t) {
            float noise = fract(sin(dot(uv * 80.0 + t, vec2(12.9898,78.233))) * 43758.5453);
            return smoothstep(0.97, 1.0, noise);
          }

          void main() {
            // Dreamy color gradient
            vec3 top = vec3(0.85, 0.93, 1.0);     // soft baby blue
            vec3 middle = vec3(0.94, 0.87, 1.0);  // pastel lilac
            vec3 bottom = vec3(0.97, 0.93, 0.98); // warm pink-white

            vec3 gradient = mix(bottom, mix(middle, top, smoothstep(0.3, 1.0, vUv.y)), vUv.y);

            // Moving sparkles
            float s1 = sparkle(vUv + vec2(time * 0.02, time * 0.03), time);
            float s2 = sparkle(vUv * 1.5 + vec2(-time * 0.015, time * 0.02), time * 0.7);
            float s3 = sparkle(vUv * 2.0 + vec2(time * 0.01, -time * 0.01), time * 1.2);
            float combined = (s1 + s2 + s3) / 3.0;

            vec3 sparkleColor = vec3(1.0, 1.0, 1.0) * combined * 0.5;
            vec3 finalColor = gradient + sparkleColor;

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
        depthWrite={false}
        depthTest={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default SoothingBackground;
