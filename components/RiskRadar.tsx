import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import RiskMesh from './RiskMesh';

// Explicitly extend JSX.IntrinsicElements to include R3F elements used in this file
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
    }
  }
}

interface RiskRadarProps {
  siprScore: number;
}

const RiskRadar: React.FC<RiskRadarProps> = ({ siprScore }) => {
  return (
    <div className="w-full h-full relative group">
      {/* Decorative overlaid HUD elements */}
      <div className="absolute top-4 left-4 z-10 font-mono text-xs text-cyan-500/50 pointer-events-none">
        <div>RADAR_ACTIVE</div>
        <div>VECTOR_SPACE: R3</div>
      </div>
      <div className="absolute bottom-4 right-4 z-10 font-mono text-xs text-cyan-500/50 pointer-events-none text-right">
        <div>GL_RENDERER</div>
        <div>FPS_UNLOCKED</div>
      </div>

      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4fd1c5" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f43f5e" />
        
        <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <RiskMesh siprScore={siprScore} />
        </Suspense>
        
        <OrbitControls enableZoom={false} autoRotate={false} />
      </Canvas>
    </div>
  );
};

export default RiskRadar;