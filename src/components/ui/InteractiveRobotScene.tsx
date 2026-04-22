"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import type { Group, Mesh } from "three";

const MODEL_URL = "/sad-toaster.glb";

interface ToasterProps {
  readonly mouse: { x: number; y: number };
  readonly scale: number;
}

function Toaster({ mouse, scale }: ToasterProps) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    // Keep the 90° base rotation on Y and add cursor-driven delta on top.
    const baseY = -Math.PI / 2;
    const targetY = baseY + mouse.x * 0.5;
    const targetX = -mouse.y * 0.18;
    group.rotation.y += (targetY - group.rotation.y) * 0.08;
    group.rotation.x += (targetX - group.rotation.x) * 0.08;
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, -Math.PI / 2, 0]}
      position={[0, -0.9, 0]}
      scale={scale}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

function Platform() {
  const ref = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.z = clock.elapsedTime * 0.1;
  });

  return (
    <mesh ref={ref} position={[0, -1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.9, 2.2, 64]} />
      <meshBasicMaterial
        color="#06b6d4"
        transparent
        opacity={0.18}
        toneMapped={false}
      />
    </mesh>
  );
}

function PlatformCore() {
  return (
    <mesh position={[0, -1.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.1, 64]} />
      <meshBasicMaterial
        color="#f59e0b"
        transparent
        opacity={0.08}
        toneMapped={false}
      />
    </mesh>
  );
}

function useResponsiveScale(): number {
  const [scale, setScale] = useState(0.85);

  useEffect(() => {
    const compute = (width: number) => {
      if (width < 640) return 0.45;
      if (width < 1024) return 0.6;
      return 0.85;
    };
    const apply = () => setScale(compute(window.innerWidth));
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  return scale;
}

function useMouseNormalized(): { x: number; y: number } {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -((event.clientY / window.innerHeight) * 2 - 1),
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return mouse;
}

export default function InteractiveRobotScene() {
  const mouse = useMouseNormalized();
  const scale = useResponsiveScale();

  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.2], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.3} color="#ffffff" />
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.9}
        color="#06b6d4"
      />
      <pointLight position={[0, -1, 3]} intensity={0.7} color="#f59e0b" />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <PlatformCore />
        <Platform />
        <Toaster mouse={mouse} scale={scale} />
      </Suspense>
    </Canvas>
  );
}
