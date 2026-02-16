
import React, { useState, useEffect } from 'react';
import { bioSocket } from './services/mockSocketService';
import { RiskProfile, RiskLevel, UI_MODE, APPLICANT_FLOW_STEP } from './types';
import SystemMonitor from './components/SystemMonitor';
import ApplicantFlow from './components/ApplicantFlow';
// Fix: Import BackendPulse component which is used in the applicant mode UI
import BackendPulse from './components/BackendPulse';

const App: React.FC = () => {
  const [data, setData] = useState<RiskProfile | null>(null);
  const [uiMode, setUiMode] = useState<UI_MODE>(UI_MODE.SYSTEM_MONITOR);
  const [activeUserStep, setActiveUserStep] = useState<APPLICANT_FLOW_STEP>(APPLICANT_FLOW_STEP.IDENTITY_SCAN);

  useEffect(() => {
    return bioSocket.subscribe(setData);
  }, []);

  if (!data) return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center font-mono text-cyan-500">
      <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
      <div className="tracking-[0.5em] animate-pulse uppercase">Booting_Aegis_V3...</div>
      <div className="text-[10px] mt-2 opacity-50 uppercase font-bold tracking-widest text-slate-500">Java 21 • Loom • ONNX Ingress</div>
    </div>
  );

  const isCritical = data.riskLevel === RiskLevel.CRITICAL || data.riskLevel === RiskLevel.HIGH;

  return (
    <div className={`h-screen w-screen flex flex-col bg-[#020617] overflow-hidden text-slate-300 font-sans transition-all duration-1000 ${isCritical ? 'shadow-[inset_0_0_150px_rgba(239,68,68,0.2)]' : ''}`}>
      
      {/* 1. HEADER: Global Context & Mode Selector */}
      <header className="h-20 flex-shrink-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-3xl flex items-center justify-between px-6 lg:px-10 z-[60] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        
        <div className="flex items-center gap-6 lg:gap-12">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-xl transition-all duration-700 ${isCritical ? 'bg-red-600 shadow-[0_0_40px_rgba(239,68,68,0.5)]' : 'bg-cyan-600 shadow-[0_0_40px_rgba(8,145,178,0.5)]'}`}>A</div>
            <div className="hidden sm:flex flex-col">
                <span className="text-[14px] font-black tracking-[0.5em] uppercase text-white">Aegis <span className="text-cyan-500">Kernel</span></span>
                <span className="text-[8px] font-mono text-slate-600 tracking-widest uppercase">Node_Region: GLOBAL-AMER-01</span>
            </div>
          </div>
          
          <div className="bg-slate-900/60 p-1 rounded-2xl border border-white/10 flex shadow-inner">
            <button 
              onClick={() => setUiMode(UI_MODE.SYSTEM_MONITOR)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uiMode === UI_MODE.SYSTEM_MONITOR ? 'bg-cyan-600 text-white shadow-2xl shadow-cyan-900/40 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Monitor
            </button>
            <button 
              onClick={() => setUiMode(UI_MODE.APPLICANT)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${uiMode === UI_MODE.APPLICANT ? 'bg-purple-600 text-white shadow-2xl shadow-purple-900/40 scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Applicant
            </button>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="hidden xl:flex flex-col items-end">
             <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">Backend Pipeline Latency</span>
             <div className="text-[12px] font-black text-emerald-400 flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
               {data.backend.p99Latency.toFixed(3)} ms P99
             </div>
          </div>
          <div className="h-10 w-px bg-white/10 hidden lg:block"></div>
          <div className="text-xs font-mono text-slate-400 bg-white/5 px-4 py-2 rounded-xl tracking-[0.2em] border border-white/5 font-bold">
            {new Date().toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 overflow-hidden relative">
        {uiMode === UI_MODE.SYSTEM_MONITOR ? (
          <SystemMonitor data={data} activeUserStep={activeUserStep} />
        ) : (
          <main className="h-full bg-slate-950 flex items-center justify-center p-0 md:p-8 lg:p-12 animate-in zoom-in-95 duration-1000 overflow-y-auto custom-scrollbar">
             <ApplicantFlow 
               onStepChange={setActiveUserStep} 
               riskData={data} 
             />
             
             {/* Dynamic Background Telemetry (Contextual) */}
             <div className="hidden 3xl:flex absolute right-16 top-1/2 -translate-y-1/2 flex-col gap-8 w-[450px] opacity-20 hover:opacity-100 transition-all duration-1000 pointer-events-none hover:pointer-events-auto scale-90">
                <div className="p-10 bg-slate-900/80 rounded-[48px] border border-white/10 backdrop-blur-3xl shadow-3xl">
                  <h4 className="text-[12px] font-black text-cyan-500 uppercase mb-8 tracking-[0.4em]">Sub-System Vitality</h4>
                  <div className="space-y-8">
                     <BackendPulse metrics={data.backend} />
                  </div>
                </div>
                <div className="p-10 bg-slate-900/80 rounded-[48px] border border-white/10 backdrop-blur-3xl shadow-3xl">
                  <h4 className="text-[12px] font-black text-purple-500 uppercase mb-8 tracking-[0.4em]">Active Ingress Log</h4>
                  <div className="font-mono text-[10px] text-slate-600 space-y-2 h-40 overflow-hidden">
                    <p className="text-cyan-500/70">>> RECEIVE: KAFKA_STREAM_001</p>
                    <p>>> PARSE: ONNX_BINARY_INPUT</p>
                    <p>>> EXEC: LOOM_VIRTUAL_THREAD_41</p>
                    <p className="text-emerald-500/50">>> VERDICT: PROCEED_TO_POLICY</p>
                    <p className="animate-pulse">>> _</p>
                  </div>
                </div>
             </div>
          </main>
        )}
      </div>

      {/* 3. FOOTER LEDGER */}
      <footer className="h-12 flex-shrink-0 bg-black border-t border-white/5 flex items-center px-8 justify-between font-mono text-[10px] tracking-tight text-slate-600 z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 animate-pulse text-[14px]">●</span>
            <span className="uppercase font-black tracking-widest text-slate-500">Kernel Security Status: SECURE</span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="uppercase font-black text-slate-700">Audit Ledger:</span>
            <span className="text-slate-500 font-bold bg-white/5 px-2 py-0.5 rounded">{data.lastAuditBlock.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <span className="hidden lg:inline text-slate-700 font-bold tracking-tighter truncate max-w-[400px]">BLOCK_HASH: {data.lastAuditBlock.hash}</span>
          <span className="text-cyan-900 font-black tracking-[0.4em] uppercase italic opacity-40">Zero-Trust Protocol V3</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
