
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

function StarParticles() {
    const ref = useRef<THREE.Points>(null!);

    // Create 5000 stars with velocities for "Star Rain"
    const count = 5000;
    const [positions, velocities] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
            vel[i] = 0.05 + Math.random() * 0.15; // Vertical fall speed
        }
        return [pos, vel];
    }, []);

    useFrame((state, delta) => {
        if (!ref.current) return;

        const array = ref.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            // Move down on Y axis (Matrix Rain Style)
            array[i * 3 + 1] -= velocities[i];

            // Wrap around if it goes too low
            if (array[i * 3 + 1] < -25) {
                array[i * 3 + 1] = 25;
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;

        // Slow drift rotation
        ref.current.rotation.z += delta / 20;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.015}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

function Nebula() {
    return (
        <mesh scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial
                side={THREE.BackSide}
                transparent
                opacity={0.15}
            >
                <canvasTexture attach="map" args={[createNebulaTexture()]} />
            </meshBasicMaterial>
        </mesh>
    );
}

function createNebulaTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
    grad.addColorStop(0, '#0a0a20');
    grad.addColorStop(0.4, '#1a1a40');
    grad.addColorStop(0.7, '#001b3a');
    grad.addColorStop(1, '#000000');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Add some nebula clouds
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = 200 + Math.random() * 300;
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        const color = i % 2 === 0 ? 'rgba(0, 100, 255, 0.05)' : 'rgba(100, 0, 255, 0.03)';
        g.addColorStop(0, color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    return canvas;
}

const SpaceView: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-black">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <fog attach="fog" args={['#000', 1, 10]} />
                <StarParticles />
                <Nebula />
            </Canvas>
        </div>
    );
};

export default SpaceView;
