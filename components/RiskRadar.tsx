
import React, { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import RiskMesh from './RiskMesh';

interface RiskRadarProps {
  siprScore: number;
}

// Componente interno para manejar la lógica de la cámara
const CameraHandler = ({ zoomLevel }: { zoomLevel: number }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Interpolar suavemente la posición Z de la cámara hacia el zoomLevel deseado
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, zoomLevel, 0.1);
    // Asegurar que la cámara siempre mire al centro
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const RiskRadar: React.FC<RiskRadarProps> = ({ siprScore }) => {
  const [zoomLevel, setZoomLevel] = useState(5.5);
  const controlsRef = useRef<any>(null);

  const handleZoomIn = useCallback(() => setZoomLevel(prev => Math.max(2.5, prev - 1.0)), []);
  const handleZoomOut = useCallback(() => setZoomLevel(prev => Math.min(10, prev + 1.0)), []);
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
        <div className="opacity-60 tracking-widest">MAGNIFICATION: {((5.5 / zoomLevel) * 100).toFixed(0)}%</div>
        <div className="opacity-60 uppercase">Z_Level: {zoomLevel.toFixed(2)}</div>
      </div>

      {/* Zoom HUD Controller - Ahora funcional */}
      <div className="absolute bottom-8 left-8 z-40 flex flex-col gap-3 pointer-events-auto">
        <div className="flex flex-col bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <ZoomButton onClick={handleZoomIn} label="+" />
          <div className="h-[1px] w-8 bg-white/5 mx-auto my-1"></div>
          <ZoomButton onClick={handleZoomOut} label="-" />
          <div className="h-[1px] w-8 bg-white/5 mx-auto my-1"></div>
          <ZoomButton onClick={handleReset} label="RST" isSmall />
        </div>
        <span className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.4em] font-black pl-2">Nav_Ctrl</span>
      </div>

      <Canvas 
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#f43f5e" />
        
        <Suspense fallback={null}>
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            <RiskMesh siprScore={siprScore} />
            <CameraHandler zoomLevel={zoomLevel} />
        </Suspense>
        
        <OrbitControls 
          ref={controlsRef}
          enableZoom={true} 
          enablePan={false}
          minDistance={2.5}
          maxDistance={10}
          onEnd={() => {
            // Sincronizar el estado cuando el usuario usa el mouse/scroll
            if (controlsRef.current) {
               setZoomLevel(controlsRef.current.object.position.length());
            }
          }}
        />
      </Canvas>
    </div>
  );
};

const ZoomButton = ({ onClick, label, isSmall = false }: any) => (
  <button 
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={`
      flex items-center justify-center transition-all hover:bg-cyan-500 hover:text-black active:scale-90
      ${isSmall ? 'h-8 text-[8px] font-black' : 'h-12 text-xl'}
      w-12 rounded-2xl text-cyan-400 font-mono
    `}
  >
    {label}
  </button>
);

export default RiskRadar;
