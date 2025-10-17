import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Trigger from '@/components/Trigger'; // Adjust path if needed
import Loader from '@/components/Loader';
import Character from '@/components/Character';
import SoothingBackground from '@/components/SoothingBackground';
import VoiceTherapy from '@/components/VoiceTherapy';
import { ErrorBoundary } from 'react-error-boundary';
import { motion, AnimatePresence } from "framer-motion";
import { SidebarTrigger } from "@/components/ui/sidebar";


const AIMinaCoach2: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [therapistReply, setTherapistReply] = useState('');

  const handleTherapistReply = (reply: string) => {
    setTherapistReply(reply);
  };

  return (
    
    <div className="w-full h-full flex flex-col bg-white relative">
      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            AI Mina Coach
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>     
      {loading && <Loader />}
      <ErrorBoundary
        fallback={<div className="flex items-center justify-center h-full bg-white">Failed to load 3D scene—check console for details.</div>}
      >
      <div className="flex-1">
        <Canvas
          camera={{ position: [0, 1.4, 1.5], fov: 25 }}
          gl={{ antialias: false }} // Helps with context issues
          style={{ background: 'white' }}
        >
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          {/* Lighting */}
          <ambientLight intensity={1} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.4}
          />
          <hemisphereLight
            groundColor="#ffffff"
            intensity={0.2}
          />
          
          <Suspense fallback={<Trigger setLoading={setLoading} />}>
            <SoothingBackground />
            <Character therapistReply={therapistReply} />
          </Suspense>
        </Canvas>
      </div>
      </ErrorBoundary>
      <VoiceTherapy onTherapistReply={handleTherapistReply} />
    </div>
  );
};

export default AIMinaCoach2;