import React, { useEffect, useRef, useState, useMemo } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { Group, SkinnedMesh } from "three";
import { API_ENDPOINTS } from "@/config/api";

type MouthCue = {
  start: number;
  end: number;
  value: string;
  intensity?: number;
};

type CharacterProps = {
  therapistReply: string;
  audioElement?: HTMLAudioElement | null;
  mouthCues?: MouthCue[];
  isMobile?: boolean;
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

const Character: React.FC<CharacterProps> = ({ 
  therapistReply, 
  audioElement, 
  mouthCues: propMouthCues, 
  isMobile = false,
  ...props 
}) => {
  const group = useRef<Group>(null);

  // --- Load model and animation ---
  const { scene, nodes, materials } = useGLTF("/model/model.glb");
  const { animations: breathingAnimation = [] } = useFBX("/animation/Breathing Idle.fbx");
  const { actions, names } = useAnimations(breathingAnimation, group);

  const [mouthCues, setMouthCues] = useState<MouthCue[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const speechStartTimeRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const lastCueEndRef = useRef(0);

  // Track animation mixer for mobile constraints
  const animationMixerRef = useRef<any>(null);

  // --- Debug info ---
  useEffect(() => {
    console.log("🟢 GLTF Scene Loaded:", scene);
    console.log("🦴 GLTF Nodes:", Object.keys(nodes || {}));
    console.log("🎞️ FBX Animations Loaded:", breathingAnimation.length);
    console.log("🎬 Animation Clip Names:", names);
    console.log("🎬 Available Actions:", actions ? Object.keys(actions) : "No actions");
  }, [scene, nodes, breathingAnimation, names, actions]);

  // --- Mesh references for lipsync ---
  const headMesh = useMemo(
    () => scene?.getObjectByName("Wolf3D_Head") as SkinnedMesh | undefined,
    [scene]
  );
  const teethMesh = useMemo(
    () => scene?.getObjectByName("Wolf3D_Teeth") as SkinnedMesh | undefined,
    [scene]
  );

  // --- Breathing animation auto-start with STRONG mobile constraints ---
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) {
      console.warn("⚠️ No animation actions found to play.");
      return;
    }

    // Pick 'breathing' if available, else first action
    const clipName =
      Object.keys(actions).find((n) => n.toLowerCase().includes("breath")) ||
      Object.keys(actions)[0];

    const action = actions[clipName];
    if (!action) {
      console.warn("⚠️ No matching animation action found:", clipName);
      return;
    }

    console.log("🚀 Playing animation:", clipName);

    action.reset().fadeIn(0.5).play();
    action.setEffectiveWeight(0.5);
    
    // MUCH SLOWER ANIMATION ON MOBILE to reduce movement
    const timeScale = isMobile ? 0.3 : 0.3; // Even slower on mobile
    action.setEffectiveTimeScale(timeScale);

    // For mobile: Reduce animation influence to minimize movement
    if (isMobile) {
      action.setEffectiveWeight(0.1); // Reduced weight on mobile
    }
    else{
      action.setEffectiveWeight(0.4); // Normal weight on desktop
    }

    return () => {
      console.log("🛑 Cleaning up animation:", clipName);
      action.fadeOut(0.5);
    };
  }, [actions, isMobile]);

  // --- REAL-TIME POSITION CONSTRAINTS FOR MOBILE ---
  useEffect(() => {
    if (!isMobile || !group.current) return;

    let constraintFrameId: number;
    const maxXMovement = 0.5; // VERY small movement allowed on mobile
    const centerX = 0; // Center position
    // Mobile uses higher Y position (-40) to bring character up in frame
    const baseY = -40;

    const applyPositionConstraints = () => {
      if (group.current) {
        const currentPos = group.current.position;
        
        // Reset to center with very tight constraints
        if (Math.abs(currentPos.x - centerX) > maxXMovement) {
          group.current.position.x = centerX + (currentPos.x > centerX ? maxXMovement : -maxXMovement);
        }
        
        // Also ensure Y position doesn't change too much
        if (Math.abs(currentPos.y - baseY) > 0.5) {
          group.current.position.y = baseY;
        }
      }
      
      constraintFrameId = requestAnimationFrame(applyPositionConstraints);
    };

    constraintFrameId = requestAnimationFrame(applyPositionConstraints);

    return () => {
      if (constraintFrameId) {
        cancelAnimationFrame(constraintFrameId);
      }
    };
  }, [isMobile]);

  // --- Lipsync logic ---
  const generateMouthCues = async (text: string) => {
    try {
      console.log("🎬 Generating lipsync cues for:", text.substring(0, 50) + "...");
      const response = await fetch(
        API_ENDPOINTS.GENERATE_CUES,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate mouth cues: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ Received mouth cues:", data.mouthCues?.length, "cues");
      
      if (Array.isArray(data.mouthCues)) {
        setMouthCues(data.mouthCues);
        lastCueEndRef.current = data.mouthCues.at(-1)?.end || 0;
      }
    } catch (error) {
      console.error("❌ Lipsync API Error:", error);
    }
  };

  const resetMouth = () => {
    if (!headMesh?.morphTargetDictionary || !teethMesh?.morphTargetDictionary) return;
    Object.values(corresponding).forEach((viseme) => {
      const headIndex = headMesh.morphTargetDictionary[viseme];
      const teethIndex = teethMesh.morphTargetDictionary[viseme];
      if (headIndex !== undefined && headMesh.morphTargetInfluences)
        headMesh.morphTargetInfluences[headIndex] = 0;
      if (teethIndex !== undefined && teethMesh.morphTargetInfluences)
        teethMesh.morphTargetInfluences[teethIndex] = 0;
    });
  };

  const animateMouth = (timestamp: number) => {
    if (!mouthCues.length || !speechStartTimeRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateMouth);
      return;
    }

    const elapsed = (timestamp - speechStartTimeRef.current) / 1000;
    
    // Check if animation is complete (past all cues)
    if (elapsed > lastCueEndRef.current + 0.2) {
      console.log("🛑 Lipsync animation completed at", elapsed.toFixed(2), "seconds");
      resetMouth();
      isSpeakingRef.current = false;
      return; // Stop the animation loop
    }
    
    const currentCue = mouthCues.find(
      (cue) => elapsed >= cue.start && elapsed < cue.end
    );

    resetMouth();

    if (currentCue && headMesh?.morphTargetDictionary) {
      const viseme =
        corresponding[currentCue.value as keyof typeof corresponding];
      const headIndex = headMesh.morphTargetDictionary[viseme];
      const teethIndex = teethMesh?.morphTargetDictionary?.[viseme];
      const influence = 0.5;
      if (headIndex !== undefined && headMesh.morphTargetInfluences)
        headMesh.morphTargetInfluences[headIndex] = influence;
      if (teethIndex !== undefined && teethMesh?.morphTargetInfluences)
        teethMesh.morphTargetInfluences[teethIndex] = influence;
    }

    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animateMouth);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateMouth);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [mouthCues]);

  // --- Load pre-generated mouth cues from parent ---
  useEffect(() => {
    if (propMouthCues && propMouthCues.length > 0) {
      console.log("✅ Loaded pre-generated mouth cues:", propMouthCues.length, "cues");
      setMouthCues(propMouthCues);
      lastCueEndRef.current = propMouthCues.at(-1)?.end || 0;
    }
  }, [propMouthCues]);

  // --- Lipsync animation logic (audio played by parent component) ---
  useEffect(() => {
    if (!therapistReply || !therapistReply.trim()) {
      // No text - stop animation and reset mouth
      isSpeakingRef.current = false;
      resetMouth();
      setMouthCues([]);
      speechStartTimeRef.current = 0;
      return;
    }

    console.log("👄 Preparing lipsync for:", therapistReply.substring(0, 50) + "...");
    
    // If no pre-generated cues provided, generate them now (fallback)
    if (!propMouthCues || propMouthCues.length === 0) {
      console.log("⚠️ No pre-generated cues - fetching from API");
      isSpeakingRef.current = false;
      generateMouthCues(therapistReply);
    } else {
      console.log("✅ Using pre-generated cues - ready for instant sync");
    }
    
    // Set up audio event listener if audio element is provided
    if (audioElement) {
      const handlePlay = () => {
        console.log("🎵 Audio started - BEGIN lipsync animation NOW");
        speechStartTimeRef.current = performance.now();
        isSpeakingRef.current = true;
      };
      
      const handleEnded = () => {
        console.log("🛑 Audio ended - STOP lipsync animation NOW");
        isSpeakingRef.current = false;
        resetMouth();
      };
      
      const handlePause = () => {
        console.log("⏸️ Audio paused - PAUSE lipsync animation");
        isSpeakingRef.current = false;
        resetMouth();
      };
      
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('ended', handleEnded);
      audioElement.addEventListener('pause', handlePause);
      
      // If audio is already playing when component mounts, start immediately
      if (!audioElement.paused && audioElement.currentTime > 0) {
        console.log("🎵 Audio already playing - starting lipsync immediately");
        speechStartTimeRef.current = performance.now() - (audioElement.currentTime * 1000);
        isSpeakingRef.current = true;
      }
      
      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('pause', handlePause);
        isSpeakingRef.current = false;
        resetMouth();
      };
    } else {
      // No audio element - start immediately (fallback)
      console.log("⚠️ No audio element provided - starting lipsync immediately");
      speechStartTimeRef.current = performance.now();
      isSpeakingRef.current = true;
    }

    // Cleanup when component unmounts or new reply comes
    return () => {
      console.log("🧹 Cleaning up lipsync");
      isSpeakingRef.current = false;
      resetMouth();
    };
  }, [therapistReply, audioElement, propMouthCues]);

  return (
    <group 
      ref={group} 
      // Mobile: higher Y position (-40) to bring character up in frame
      // Desktop: standard position (-42)
      position={isMobile ? [0, -40, 0] : [0, -42, 0]}
    >
      {scene ? (
        <primitive 
          object={scene} 
          // Mobile: slightly smaller scale to fit better in viewport
          scale={isMobile ? [18, 18, 23] : [19, 19, 24]} 
          rotation={[-0.7, 0, 0]} 
        />
      ) : null}
    </group>
  );
};

export default Character;