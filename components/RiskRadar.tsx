
import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import RiskMesh from './RiskMesh';

interface RiskRadarProps {
  siprScore: number;
}

const RiskRadar: React.FC<RiskRadarProps> = ({ siprScore }) => {
  const [zoomLevel, setZoomLevel] = useState(5.5);

  const handleZoomIn = useCallback(() => setZoomLevel(prev => Math.max(2.5, prev - 0.5)), []);
  const handleZoomOut = useCallback(() => setZoomLevel(prev => Math.min(10, prev + 0.5)), []);
  const handleReset = useCallback(() => setZoomLevel(5.5), []);

  return (
    <div className="w-full h-full relative group">
      {/* Decorative overlaid HUD elements */}
      <div className="absolute top-6 left-6 z-30 font-mono text-[9px] text-cyan-500/50 pointer-events-none space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
          RADAR_ACTIVE
        </div>
        <div className="opacity-60">VECTOR_SPACE: R3_COORD</div>
        <div className="opacity-60">SAMPLING_RATE: 2.4GHz</div>
      </div>

      <div className="absolute bottom-6 right-6 z-30 font-mono text-[9px] text-cyan-500/50 pointer-events-none text-right space-y-1">
        <div className="opacity-60">MAGNIFICATION: {((5.5 / zoomLevel) * 100).toFixed(0)}%</div>
        <div className="opacity-60">BUFFER: 0x82FA...99</div>
      </div>

      {/* Zoom HUD Controller */}
      <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-2 pointer-events-auto">
        <div className="flex flex-col bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-2xl overflow-hidden">
          <ZoomButton onClick={handleZoomIn} label="+" />
          <div className="h-[1px] w-full bg-white/5 mx-auto"></div>
          <ZoomButton onClick={handleZoomOut} label="-" />
          <div className="h-[1px] w-full bg-white/5 mx-auto"></div>
          <ZoomButton onClick={handleReset} label="RST" isSmall />
        </div>
        <span className="text-[7px] font-mono text-slate-700 uppercase tracking-widest font-black pl-2">Z_Axis_Nav</span>
      </div>

      <Canvas 
        camera={{ position: [0, 0, zoomLevel], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#4fd1c5" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f43f5e" />
        
        <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <RiskMesh siprScore={siprScore} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true} 
          autoRotate={false} 
          minDistance={2.5}
          maxDistance={10}
          onEnd={(e) => {
            // Sincronizar el estado del HUD si el usuario usa la rueda del ratón
            if (e?.target?.object?.position?.z) {
              setZoomLevel(e.target.object.position.z);
            }
          }}
        />
      </Canvas>
    </div>
  );
};

const ZoomButton = ({ onClick, label, isSmall = false }: any) => (
  <button 
    onClick={onClick}
    className={`
      flex items-center justify-center transition-all hover:bg-white/10 active:scale-90
      ${isSmall ? 'h-6 text-[7px] font-black' : 'h-10 text-lg'}
      w-10 rounded-xl text-cyan-400 font-mono
    `}
  >
    {label}
  </button>
);

export default RiskRadar;
