
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
  const isCritical = data.riskLevel === RiskLevel.CRITICAL;

  return (
    <div className="h-full w-full grid grid-rows-[auto_1fr] gap-4 p-4 md:p-6 lg:p-8 overflow-hidden bg-[#02040a]">
      
      {/* 1. TOP PERFORMANCE HUD */}
      <div className="grid grid-cols-[1fr_auto] items-center gap-6 shrink-0">
        <div className="flex gap-6 overflow-x-auto no-scrollbar pb-1">
          <StatMini label="THROUGHPUT" value="24.2k" color="text-cyan-500" />
          <StatMini label="CONFIDENCE" value={`${(100 - data.siprScore * 100).toFixed(1)}%`} color="text-emerald-500" />
          <StatMini label="LATENCY" value="1.1ms" color="text-purple-500" />
        </div>
        
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-xl shrink-0">
          <button 
            onClick={() => setActiveTab('RISK')}
            className={`px-4 md:px-8 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'RISK' ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'text-slate-500'}`}
          >
            Cortex
          </button>
          <button 
            onClick={() => setActiveTab('COLLECTIONS')}
            className={`px-4 md:px-8 py-2 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'COLLECTIONS' ? 'bg-white text-black shadow-xl' : 'text-slate-500'}`}
          >
            Ledger
          </button>
        </div>
      </div>

      {/* 2. MAIN VIEWPORT - Desbloqueado para scroll en móviles */}
      <div className="min-h-0 overflow-y-auto custom-scrollbar">
        {activeTab === 'RISK' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-full auto-rows-min lg:auto-rows-auto">
            
            {/* SIDEBAR LEFT */}
            <div className="lg:col-span-3 grid gap-6 order-2 lg:order-1">
              <Panel label="Sub-System_Vitality" accent="cyan">
                <BackendPulse metrics={data.backend} />
              </Panel>
              
              <Panel label="Bio-Spectral_Vectors" accent="purple">
                <div className="grid gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <MetaRow label="OS_KERNEL" value="DARWIN_XNU" />
                    <MetaRow label="NET_LAYER" value="WIFI" />
                  </div>
                  <TelemetryLine label="Behavioral Jitter" value={data.telemetry.keystrokeJitter} color="bg-purple-500" />
                  <TelemetryLine label="Spectral Stability" value={data.telemetry.deviceStability} color="bg-cyan-500" />
                </div>
              </Panel>
            </div>

            {/* CENTER HUD */}
            <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2 h-[450px] sm:h-[550px] lg:h-full">
              <div className="flex-1 bg-black/40 border border-white/5 rounded-[3rem] relative overflow-hidden group shadow-2xl">
                <div className="absolute inset-0 opacity-50 scale-110">
                  <RiskRadar siprScore={data.siprScore} />
                </div>
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
                <div className="absolute inset-0 grid place-items-center z-20 p-6">
                  <div className="text-center">
                    <span className="text-[10px] font-black tracking-[0.6em] text-slate-500 uppercase mb-4 block animate-pulse">Scanning_Active_Vectors</span>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                      {data.applicantName}
                    </h2>
                    <div className="flex flex-col items-center gap-6 mt-8">
                       <div className="relative">
                          <div className={`text-6xl md:text-8xl font-black font-mono tracking-tighter ${isCritical ? 'text-red-500' : 'text-cyan-400'}`}>
                            {(data.siprScore * 100).toFixed(2)}<span className="text-xl md:text-2xl opacity-20 ml-2">%</span>
                          </div>
                          <div className="absolute -top-4 -right-8">
                             <div className={`px-4 py-1.5 rounded-full border-2 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] backdrop-blur-md ${isCritical ? 'border-red-600 bg-red-600/10 text-red-500' : 'border-cyan-500 bg-cyan-500/10 text-cyan-400'}`}>
                               {data.riskLevel}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR RIGHT */}
            <div className="lg:col-span-3 grid gap-6 order-3">
               <Panel label="Heuristic_Engine" accent="cyan">
                  <div className="grid gap-6">
                    <JudgeRow name="Tabular Inference" score={data.judges.tabularScore} type="XGB_V4" />
                    <JudgeRow name="Temporal Mesh" score={data.judges.sequentialScore} type="RNN_LSTM" />
                    <JudgeRow name="Relational Graph" score={data.judges.graphScore} type="GNN_REL" />
                  </div>
               </Panel>
               <Panel label="Forensic_Audit_Feed" accent="red" fill>
                  <div className="h-[250px] lg:h-full">
                    <ForensicPanel anomalies={data.anomalies} />
                  </div>
               </Panel>
            </div>
          </div>
        ) : (
          <CollectionsDashboard cases={data.collections.cases} metrics={data.collections.metrics} />
        )}
      </div>
    </div>
  );
};

// Mantenemos los sub-componentes auxiliares igual pero asegurando nitidez
const StatMini = ({ label, value, color }: any) => (
  <div className="grid shrink-0 min-w-[90px]">
    <span className="text-[7px] md:text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-0.5">{label}</span>
    <span className={`text-[11px] md:text-xs font-black font-mono tracking-tighter ${color}`}>{value}</span>
    <div className="h-[1px] w-full bg-white/5 mt-1">
      <div className={`h-full bg-current opacity-30`} style={{width: '60%'}}></div>
    </div>
  </div>
);

const Panel = ({ children, label, accent, fill }: any) => (
  <section className={`glass rounded-[2rem] p-6 grid grid-rows-[auto_1fr] border-white/5 ${fill ? 'lg:h-full' : ''}`}>
    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full ${accent === 'cyan' ? 'bg-cyan-500 animate-pulse' : accent === 'red' ? 'bg-red-500' : 'bg-purple-500'}`}></span>
      {label}
    </h3>
    <div className="min-h-0">{children}</div>
  </section>
);

const TelemetryLine = ({ label, value, color }: any) => (
  <div className="grid gap-2">
    <div className="flex justify-between items-end">
      <span className="text-[8px] font-black text-slate-600 uppercase tracking-wider">{label}</span>
      <span className="text-[10px] font-mono font-bold text-white">{(value * 100).toFixed(0)}%</span>
    </div>
    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000`} style={{width: `${value * 100}%`}}></div>
    </div>
  </div>
);

const MetaRow = ({ label, value }: any) => (
  <div className="grid gap-1">
    <span className="text-[7px] font-mono text-slate-700 uppercase font-black">{label}</span>
    <span className="text-[10px] text-white font-bold truncate tracking-widest">{value}</span>
  </div>
);

const JudgeRow = ({ name, score, type }: any) => (
  <div className="grid gap-2">
    <div className="flex justify-between items-center">
      <div className="grid">
        <div className="text-[6px] font-mono text-slate-700 font-bold uppercase">{type}</div>
        <div className="text-[9px] font-black text-white uppercase tracking-tight">{name}</div>
      </div>
      <div className={`text-sm font-black font-mono ${score > 0.8 ? 'text-red-500' : 'text-cyan-500'}`}>{score.toFixed(3)}</div>
    </div>
    <div className="grid grid-cols-10 gap-0.5 h-1">
      {Array.from({length: 10}).map((_, i) => (
        <div key={i} className={`rounded-sm transition-all duration-700 ${i < Math.floor(score * 10) ? (score > 0.8 ? 'bg-red-500' : 'bg-cyan-500') : 'bg-white/5'}`}></div>
      ))}
    </div>
  </div>
);

export default SystemMonitor;
