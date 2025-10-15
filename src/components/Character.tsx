import React, { useEffect, useRef, useState, useMemo } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { Group, SkinnedMesh } from "three";

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

  // --- Load model and animation ---
  const { scene, nodes, materials } = useGLTF("/model/model.glb");
  const { animations: breathingAnimation = [] } = useFBX("/animation/Breathing Idle.fbx");
  const { actions, names } = useAnimations(breathingAnimation, group);

  const [mouthCues, setMouthCues] = useState<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const speechStartTimeRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const lastCueEndRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

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

  // --- Breathing animation auto-start ---
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
    action.setEffectiveTimeScale(0.4);// Slow down for subtle breathing

    return () => {
      console.log("🛑 Cleaning up animation:", clipName);
      action.fadeOut(0.5);
    };
  }, [actions]);

  // --- Lipsync logic ---
  const generateMouthCues = async (text: string) => {
    try {
      const response = await fetch(
        "https://lipsync-api-app-bwaxdtgfgqe8bqd8.centralindia-01.azurewebsites.net/generate-cues",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate mouth cues");

      const data = await response.json();
      if (Array.isArray(data.mouthCues)) {
        setMouthCues(data.mouthCues);
        lastCueEndRef.current = data.mouthCues.at(-1)?.end || 0;
      }
    } catch (error) {
      console.error("Lipsync API Error:", error);
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

  // --- Speech logic ---
  useEffect(() => {
    if (!therapistReply) return;

    isSpeakingRef.current = true;
    generateMouthCues(therapistReply);

    const utterance = new SpeechSynthesisUtterance(therapistReply);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.lang = "en-US";

    utterance.onstart = () => {
      speechStartTimeRef.current = performance.now();
    };

    utterance.onend = () => {
      isSpeakingRef.current = false;
      resetMouth();
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);

    return () => {
      speechSynthesis.cancel();
      isSpeakingRef.current = false;
      resetMouth();
    };
  }, [therapistReply]);

  return (
    <group ref={group} position={[0, -42, 0]}>
      {scene ? (
        <primitive object={scene} scale={[19, 19, 24]} rotation={[-0.7, 0, 0]} />
      ) : null}
    </group>
  );
};

export default Character;
