import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { Group, SkinnedMesh } from 'three';

type CharacterProps = {
  therapistReply: string;
};

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
} as const;

const Character: React.FC<CharacterProps> = ({ therapistReply, ...props }) => {
  const group = useRef<Group>(null);
  const gltf = useGLTF('/model/model.glb');
  const { scene, nodes, materials } = gltf;
  const fbx = useFBX('/animation/Breathing Idle.fbx');
  const { animations: breathingAnimation } = fbx;
  const [mouthCues, setMouthCues] = useState<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const speechStartTimeRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const lastCueEndRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Early return if model failed to load
  useEffect(() => {
    console.log('Loaded Scene:', scene); // Debug: Check scene
    console.log('Loaded Nodes:', Object.keys(nodes || {})); // Debug: Check node names
    console.log('Loaded Materials:', Object.keys(materials || {})); // Debug: Check material names
    if (!scene) {
      console.warn('GLTF scene not loaded—check /model/model.glb path');
    }
    if (!breathingAnimation || breathingAnimation.length === 0) {
      console.warn('FBX animations not loaded—check /animation/Breathing Idle.fbx path');
    }
  }, [scene, nodes, materials, breathingAnimation]);

  if (!scene) {
    return <group {...props} />; // Empty group as fallback
  }

  // Memoized meshes for lipsync
  const headMesh = useMemo(() => scene.getObjectByName('Wolf3D_Head') as SkinnedMesh | undefined, [scene]);
  const teethMesh = useMemo(() => scene.getObjectByName('Wolf3D_Teeth') as SkinnedMesh | undefined, [scene]);

  // Fix: Safe assignment to animation name
  if (breathingAnimation && breathingAnimation[0]) {
    breathingAnimation[0].name = "breathing";
  }
  const { actions } = useAnimations(breathingAnimation || [], group);

  // Initialize breathing animation
  useEffect(() => {
    if (actions['breathing']) {
      actions['breathing'].reset().fadeIn(0.5).play();
      actions['breathing'].setEffectiveWeight(0.3);
      actions['breathing'].setEffectiveTimeScale(0.5);
    }
    return () => {
      if (actions['breathing']) actions['breathing'].fadeOut(0.5);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [actions]);

  // Handle speech and lip sync
  useEffect(() => {
    if (!therapistReply) return;

    isSpeakingRef.current = true;
    generateMouthCues(therapistReply);
    
    utteranceRef.current = new SpeechSynthesisUtterance(therapistReply);
    utteranceRef.current.rate = 0.9;
    utteranceRef.current.pitch = 1.0;
    utteranceRef.current.lang = 'en-US';
    utteranceRef.current.onstart = () => {
      speechStartTimeRef.current = performance.now();
    };
    utteranceRef.current.onend = () => {
      isSpeakingRef.current = false;
      resetMouth();
    };
    speechSynthesis.speak(utteranceRef.current);

    return () => {
      speechSynthesis.cancel();
      isSpeakingRef.current = false;
      resetMouth();
    };
  }, [therapistReply]);

  const generateMouthCues = async (text: string) => {
    try {
      const response = await fetch('https://lipsync-api-app-bwaxdtgfgqe8bqd8.centralindia-01.azurewebsites.net/generate-cues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('Failed to generate mouth cues');
      
      const { mouthCues } = await response.json();
      if (Array.isArray(mouthCues)) {
        setMouthCues(mouthCues);
        lastCueEndRef.current = mouthCues[mouthCues.length - 1]?.end || 0;
      }
    } catch (error) {
      console.error('Lipsync API Error:', error);
    }
  };

  const resetMouth = () => {
    // Guard: Skip if no meshes or morph targets available
    if (!headMesh?.morphTargetDictionary || !teethMesh?.morphTargetDictionary) {
      console.warn('Morph targets not available for lipsync');
      return;
    }

    Object.values(corresponding).forEach(viseme => {
      const headIndex = headMesh.morphTargetDictionary[viseme];
      const teethIndex = teethMesh.morphTargetDictionary[viseme];
      if (headIndex !== undefined && headMesh.morphTargetInfluences) {
        headMesh.morphTargetInfluences[headIndex] = 0;
      }
      if (teethIndex !== undefined && teethMesh.morphTargetInfluences) {
        teethMesh.morphTargetInfluences[teethIndex] = 0;
      }
    });
  };

  const animateMouth = (timestamp: number) => {
    if (!mouthCues.length || !speechStartTimeRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateMouth);
      return;
    }

    const elapsed = (timestamp - speechStartTimeRef.current) / 1000;
    const lipSyncSpeed = 0.6;
    const adjustedElapsed = elapsed * lipSyncSpeed;

    const currentCue = mouthCues.find(cue => adjustedElapsed >= cue.start && adjustedElapsed < cue.end);

    // Reset all visemes first
    resetMouth();

    if (currentCue) {
      // Guard: Skip if no meshes or morph targets
      if (!headMesh?.morphTargetDictionary || !teethMesh?.morphTargetDictionary) {
        animationFrameRef.current = requestAnimationFrame(animateMouth);
        return;
      }
      
      const viseme = corresponding[currentCue.value as keyof typeof corresponding];
      
      const headIndex = headMesh.morphTargetDictionary[viseme];
      const influence = 0.5;
      if (headIndex !== undefined && headMesh.morphTargetInfluences) {
        headMesh.morphTargetInfluences[headIndex] = influence;
      }
      
      const teethIndex = teethMesh.morphTargetDictionary[viseme];
      if (teethIndex !== undefined && teethMesh.morphTargetInfluences) {
        teethMesh.morphTargetInfluences[teethIndex] = influence;
      }
    }

    if (!isSpeakingRef.current && elapsed > lastCueEndRef.current + 0.1) {
      resetMouth();
      return;
    }

    animationFrameRef.current = requestAnimationFrame(animateMouth);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateMouth);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [mouthCues]);

  return (
    <group ref={group} {...props} position={[0, -42, 0]}>
      <primitive 
        object={scene} 
        scale={[19, 19, 24]} 
        rotation={[-0.7, 0, 0]} 
      />
    </group>
  );
};

export default Character;