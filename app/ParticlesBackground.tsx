import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  const orbCount = 25;
  
  // Create orbs with random properties
  const orbs = useMemo(() => {
    return Array.from({ length: orbCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.5 + 0.3,
      rotationSpeed: Math.random() * 0.02,
      color: i % 3 === 0 
        ? new THREE.Color(0.6, 0.4, 1.0)  // Purple
        : i % 3 === 1 
        ? new THREE.Color(0.4, 0.6, 1.0)  // Blue
        : new THREE.Color(1.0, 0.5, 0.8), // Pink
      phase: Math.random() * Math.PI * 2
    }));
  }, [orbCount]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((orb, i) => {
      const orbData = orbs[i];
      
      // Floating animation with sine waves
      orb.position.y = orbData.position[1] + Math.sin(time * orbData.speed + orbData.phase) * 2;
      orb.position.x = orbData.position[0] + Math.cos(time * orbData.speed * 0.7 + orbData.phase) * 1.5;
      
      // Gentle rotation
      orb.rotation.x = time * orbData.rotationSpeed;
      orb.rotation.y = time * orbData.rotationSpeed * 0.7;
      
      // Pulsing scale
      const pulse = Math.sin(time * 2 + orbData.phase) * 0.1 + 1;
      orb.scale.setScalar(orbData.scale * pulse);
    });
    
    // Rotate entire group slowly
    groupRef.current.rotation.y = time * 0.05;
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial 
            color={orb.color}
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
          {/* Glow effect */}
          <mesh scale={1.5}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial 
              color={orb.color}
              transparent
              opacity={0.15}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </mesh>
      ))}
    </group>
  );
}

function WaveGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  const gridSize = 60;
  const spacing = 1;
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      gridSize * spacing, 
      gridSize * spacing, 
      gridSize, 
      gridSize
    );
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positions = meshRef.current.geometry.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Create wave effect
      const distance = Math.sqrt(x * x + y * y);
      const wave1 = Math.sin(distance * 0.3 - time * 2) * 0.8;
      const wave2 = Math.sin(x * 0.2 + time) * 0.5;
      const wave3 = Math.cos(y * 0.2 + time * 0.7) * 0.5;
      
      positions.setZ(i, wave1 + wave2 + wave3);
    }
    
    positions.needsUpdate = true;
    meshRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry}
      rotation={[-Math.PI / 3, 0, 0]}
      position={[0, -8, -5]}
    >
      <meshBasicMaterial 
        color={new THREE.Color(0.5, 0.5, 1.0)}
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
}

function AnimatedGradient() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0.6, 0.4, 1.0) }, // Purple
        color2: { value: new THREE.Color(0.4, 0.6, 1.0) }, // Blue
        color3: { value: new THREE.Color(1.0, 0.5, 0.8) }  // Pink
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform vec3 color3;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          
          // Animated gradient
          float mixer1 = sin(time * 0.5 + uv.x * 3.0) * 0.5 + 0.5;
          float mixer2 = cos(time * 0.3 + uv.y * 3.0) * 0.5 + 0.5;
          
          vec3 color = mix(color1, color2, mixer1);
          color = mix(color, color3, mixer2 * 0.5);
          
          // Add some noise/variation
          float noise = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time) * 0.1;
          
          gl_FragColor = vec4(color + noise, 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    material.uniforms.time.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[50, 50]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function ParticlesBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* <AnimatedGradient /> */}
        <FloatingOrbs />
        <WaveGrid />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}