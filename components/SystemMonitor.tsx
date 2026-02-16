
import React, { useState } from 'react';
import { RiskProfile, RiskLevel, APPLICANT_FLOW_STEP } from '../types';
import RiskRadar from './RiskRadar';
import BackendPulse from './BackendPulse';
import ForensicPanel from './ForensicPanel';
import CollectionsDashboard from './CollectionsDashboard';

interface SystemMonitorProps {
  data: RiskProfile;
  activeUserStep: APPLICANT_FLOW_STEP;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ data, activeUserStep }) => {
  const [activeTab, setActiveTab] = useState<'RISK' | 'COLLECTIONS'>('RISK');
  const isCritical = data.riskLevel === RiskLevel.CRITICAL || data.riskLevel === RiskLevel.HIGH;

  return (
    <div className="h-full w-full p-2 md:p-4 lg:p-6 overflow-hidden bg-slate-950 flex flex-col">
      
      {/* Tab Selector - HUD Estilo Militar */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-slate-900/60 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
           <button 
            onClick={() => setActiveTab('RISK')}
            className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'RISK' ? 'bg-white text-black shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
           >
            Risk_Inference
           </button>
           <button 
            onClick={() => setActiveTab('COLLECTIONS')}
            className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'COLLECTIONS' ? 'bg-amber-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
           >
            Cognitive_Collections
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto lg:overflow-hidden custom-scrollbar">
        {activeTab === 'RISK' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 lg:gap-6 h-full auto-rows-max lg:auto-rows-fr">
            
            {/* COLUMNA IZQUIERDA: INFRAESTRUCTURA */}
            <div className="lg:col-span-3 flex flex-col gap-3 md:gap-4 order-2 lg:order-1">
              <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 md:p-5 backdrop-blur-xl">
                <header className="flex justify-between items-center mb-4">
                  <h3 className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                    KERNEL_V21
                  </h3>
                  <span className="text-[7px] font-mono text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded">ZGC_ON</span>
                </header>
                <BackendPulse metrics={data.backend} />
              </section>

              <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 md:p-5 flex-1 min-h-[200px] lg:min-h-0 backdrop-blur-xl flex flex-col overflow-hidden">
                <h3 className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  BIO_TELEMETRY
                </h3>
                <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  <MetricBar label="Keystroke Jitter" value={data.telemetry.keystrokeJitter} color="bg-purple-500" />
                  <MetricBar label="Stability" value={data.telemetry.deviceStability} color="bg-emerald-500" />
                  <div className="pt-3 border-t border-white/5 mt-auto grid grid-cols-2 gap-2 text-[8px] font-mono text-slate-500">
                    <div>LATENCY: <span className="text-white">{data.backend.p99Latency.toFixed(2)}ms</span></div>
                    <div className="text-right">THREADS: <span className="text-cyan-400">{data.backend.virtualThreads}</span></div>
                  </div>
                </div>
              </section>
            </div>

            {/* CENTRO: NEURAL CORTEX */}
            <div className="lg:col-span-6 flex flex-col gap-3 md:gap-4 order-1 lg:order-2">
              <div className="flex-1 min-h-[350px] sm:min-h-[450px] lg:min-h-0 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-[2rem] relative overflow-hidden shadow-2xl flex flex-col">
                <div className="p-5 md:p-8 z-20 pointer-events-none">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[7px] md:text-[8px] font-black text-cyan-400 uppercase tracking-widest backdrop-blur-md">
                      LIVE_INFERENCE_NODE
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight drop-shadow-2xl truncate">
                    {data.applicantName}
                  </h2>
                  <div className="text-[8px] md:text-[10px] font-mono text-slate-500 mt-1 uppercase flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                    STEP: <span className="text-purple-400 font-bold">{activeUserStep}</span>
                  </div>
                </div>
                <div className="absolute inset-0 z-0">
                  <RiskRadar siprScore={data.siprScore} />
                </div>
                <div className="mt-auto p-3 md:p-6 z-20">
                  <div className="bg-slate-950/70 backdrop-blur-2xl p-4 md:p-6 rounded-[1.5rem] border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                      <span className="text-[7px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                        PROBABILITY_INDEX
                      </span>
                      <div className={`text-4xl sm:text-5xl lg:text-7xl font-black font-mono tracking-tighter ${isCritical ? 'text-red-500' : 'text-cyan-400'}`}>
                        {(data.siprScore * 100).toFixed(2)}<span className="text-xl opacity-30 ml-1">%</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                      <div className={`text-sm md:text-xl font-black uppercase tracking-widest px-4 py-1.5 border-2 rounded-xl ${isCritical ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-cyan-500/40 bg-cyan-500/5 text-white'}`}>
                        {data.riskLevel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-3 shrink-0">
                 {data.explanation.slice(0, 3).map((exp, i) => (
                   <div key={i} className="bg-slate-900/40 border border-white/5 rounded-xl p-2.5 md:p-4 flex flex-col justify-center backdrop-blur-md">
                      <div className="text-[6px] md:text-[7px] font-mono text-slate-600 uppercase mb-0.5 truncate tracking-widest">{exp.feature}</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs md:text-lg font-black ${exp.impact < 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {exp.impact < 0 ? '▼' : '▲'}{(Math.abs(exp.impact) * 100).toFixed(0)}%
                        </span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* COLUMNA DERECHA: FORENSICS */}
            <div className="lg:col-span-3 flex flex-col gap-3 md:gap-4 order-3 lg:order-3">
              <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 md:p-5 h-auto lg:h-[40%] flex flex-col backdrop-blur-xl">
                <h3 className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex justify-between items-center">
                  <span>ONNX_JUDGES</span>
                  <span className="text-[7px] opacity-40">v4.0</span>
                </h3>
                <div className="space-y-5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                  <JudgeRow name="Tabular" score={data.judges.tabularScore} type="XGB" />
                  <JudgeRow name="Sequence" score={data.judges.sequentialScore} type="RNN" />
                  <JudgeRow name="Mesh" score={data.judges.graphScore} type="GNN" />
                </div>
              </section>

              <section className="bg-slate-900/40 border border-white/10 rounded-2xl p-4 md:p-5 flex-1 min-h-[250px] lg:min-h-0 backdrop-blur-xl flex flex-col overflow-hidden">
                <ForensicPanel anomalies={data.anomalies} />
              </section>
            </div>
          </div>
        ) : (
          <CollectionsDashboard cases={data.collections.cases} metrics={data.collections.metrics} />
        )}
      </div>
    </div>
  );
};

// Micro-Componentes
const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="flex flex-col gap-1 group">
    <div className="flex justify-between items-end">
      <span className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-[9px] font-mono font-bold text-white">{(value * 100).toFixed(0)}%</span>
    </div>
    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
      <div className={`h-full ${color} transition-all duration-1000`} style={{ width: `${value * 100}%` }}></div>
    </div>
  </div>
);

const JudgeRow: React.FC<{ name: string; score: number; type: string }> = ({ name, score, type }) => (
  <div className="flex flex-col gap-1.5 group">
    <div className="flex justify-between items-center">
      <div>
        <div className="text-[6px] font-mono text-slate-600 uppercase font-bold">{type}</div>
        <div className="text-[10px] font-black text-white uppercase truncate max-w-[80px]">{name}</div>
      </div>
      <div className={`text-sm md:text-base font-black font-mono ${score > 0.8 ? 'text-red-500' : 'text-cyan-500'}`}>
        {score.toFixed(2)}
      </div>
    </div>
    <div className="flex gap-0.5 h-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className={`flex-1 rounded-sm transition-all duration-700 ${i < Math.floor(score * 8) ? (score > 0.8 ? 'bg-red-500' : 'bg-cyan-500') : 'bg-slate-800'}`}></div>
      ))}
    </div>
  </div>
);

export default SystemMonitor;
