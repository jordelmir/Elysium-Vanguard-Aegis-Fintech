
import React, { useState, useEffect } from 'react';
import { RiskProfile, RiskLevel, APPLICANT_FLOW_STEP } from '../types';
import RiskRadar from './RiskRadar';
import BackendPulse from './BackendPulse';
import ForensicPanel from './ForensicPanel';
import CollectionsDashboard from './CollectionsDashboard';

interface SystemMonitorProps {
  data: RiskProfile;
  activeUserStep: APPLICANT_FLOW_STEP;
  forcedTab?: 'RISK' | 'COLLECTIONS';
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ data, activeUserStep, forcedTab }) => {
  const [activeTab, setActiveTab] = useState<'RISK' | 'COLLECTIONS'>(forcedTab || 'RISK');

  useEffect(() => {
    if (forcedTab) setActiveTab(forcedTab);
  }, [forcedTab]);

  const isCritical = data.riskLevel === RiskLevel.CRITICAL;

  return (
    <div className="h-full w-full grid grid-rows-[auto_1fr] gap-6 p-4 md:p-8 lg:p-10 overflow-hidden bg-[#02040a]">
      
      {/* 1. TOP PERFORMANCE HUD - Responsive Layout */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
          <StatMini label="GLOBAL_THROUGHPUT" value="24.2k" color="text-cyan-500" />
          <StatMini label="NODE_CONFIDENCE" value={`${(100 - data.siprScore * 100).toFixed(1)}%`} color="text-emerald-500" />
          <StatMini label="LATENCY_P99" value="1.1ms" color="text-purple-500" />
        </div>
        
        {!forcedTab && (
          <nav className="inline-flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-3xl shrink-0">
            <button 
              onClick={() => setActiveTab('RISK')}
              className={`px-6 md:px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'RISK' ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Macro_Cortex
            </button>
            <button 
              onClick={() => setActiveTab('COLLECTIONS')}
              className={`px-6 md:px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'COLLECTIONS' ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Ops_Hub
            </button>
          </nav>
        )}
      </div>

      {/* 2. MAIN VIEWPORT - Responsive Grid Matrix */}
      <div className="min-h-0 overflow-y-auto no-scrollbar">
        {activeTab === 'RISK' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 h-full">
            
            {/* SIDEBAR LEFT - Telemetry Cluster */}
            <div className="lg:col-span-3 flex flex-col gap-6 md:gap-8 order-2 lg:order-1">
              <Panel label="Sub-System_Vitality" accent="cyan">
                <BackendPulse metrics={data.backend} />
              </Panel>
              
              <Panel label="Bio-Digital_Vectors" accent="purple">
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <MetaRow label="OS_KERNEL" value="DARWIN_XNU" />
                    <MetaRow label="NET_LAYER" value="5G_ENCRYPTED" />
                  </div>
                  <TelemetryLine label="Behavioral_Jitter" value={data.telemetry.keystrokeJitter} color="bg-purple-500" />
                  <TelemetryLine label="Vector_Stability" value={data.telemetry.deviceStability} color="bg-cyan-500" />
                </div>
              </Panel>
            </div>

            {/* CENTER HUD - Visual Core Radar */}
            <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8 order-1 lg:order-2 h-[450px] md:h-[600px] lg:h-full">
              <div className="flex-1 bg-black/40 border border-white/5 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-1000 scale-110 group-hover:scale-125 transition-transform duration-10000">
                  <RiskRadar siprScore={data.siprScore} />
                </div>
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.8)_100%)]"></div>
                
                <div className="absolute inset-0 grid place-items-center z-20 p-8">
                  <div className="text-center space-y-4 md:space-y-8">
                    <div className="space-y-2">
                       <span className="text-[10px] md:text-[12px] font-black tracking-[1em] text-cyan-500 uppercase block animate-pulse">Infrastructure_Active</span>
                       <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] truncate max-w-[80vw]">
                         {data.applicantName}
                       </h2>
                    </div>
                    
                    <div className="flex flex-col items-center gap-6">
                       <div className="relative inline-block">
                          <div className={`text-7xl md:text-9xl font-black font-mono tracking-tighter leading-none ${isCritical ? 'text-red-500' : 'text-cyan-400'}`}>
                            {(data.siprScore * 100).toFixed(2)}<span className="text-2xl md:text-4xl opacity-20 ml-2">%</span>
                          </div>
                          <div className="absolute -top-4 -right-12 md:-right-16">
                             <div className={`px-5 py-2 rounded-full border-2 font-black text-[10px] md:text-sm uppercase tracking-widest backdrop-blur-xl ${isCritical ? 'border-red-600 bg-red-600/20 text-red-500 shadow-[0_0_30px_rgba(255,0,0,0.3)]' : 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-[0_0_30px_rgba(0,242,255,0.3)]'}`}>
                               {data.riskLevel}
                             </div>
                          </div>
                       </div>
                       <p className="text-[9px] md:text-[11px] font-mono text-slate-500 uppercase tracking-[0.5em] italic">Real_Time_Sipr_Index</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SIDEBAR RIGHT - Forensic & Audit */}
            <div className="lg:col-span-3 flex flex-col gap-6 md:gap-8 order-3">
               <Panel label="Audit_Analytics" accent="cyan">
                  {data.aiAudit ? (
                    <div className="grid gap-6 animate-in fade-in zoom-in-95 duration-700">
                      <div className="p-5 bg-white/5 border border-white/10 rounded-[2rem] shadow-inner">
                        <span className="text-[9px] font-mono text-cyan-500 uppercase block mb-3 font-black">AI_Verdicto_Audit</span>
                        <p className="text-xs md:text-sm text-white font-bold leading-relaxed">{data.aiAudit.verdict}</p>
                      </div>
                      <div className="grid gap-4">
                        {data.aiAudit.reasoning?.map((r: string, i: number) => (
                          <div key={i} className="text-[10px] md:text-xs text-slate-400 border-l-2 border-cyan-500/40 pl-5 leading-relaxed font-medium">
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-8">
                      <JudgeRow name="Tabular_Inference" score={data.judges.tabularScore} type="XGB_V4" />
                      <JudgeRow name="Temporal_Mesh" score={data.judges.sequentialScore} type="RNN_LSTM" />
                      <JudgeRow name="Relational_Graph" score={data.judges.graphScore} type="GNN_REL" />
                    </div>
                  )}
               </Panel>
               <Panel label="Forensic_Anomaly_Feed" accent="red" fill>
                  <div className="h-[350px] md:h-[450px] lg:h-full min-h-0 overflow-hidden">
                    <ForensicPanel anomalies={data.anomalies} />
                  </div>
               </Panel>
            </div>
          </div>
        ) : (
          <div className="h-full animate-in slide-in-from-right-12 duration-700">
            <CollectionsDashboard cases={data.collections.cases} metrics={data.collections.metrics} />
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-componentes auxiliares - Responsive Optimized

const StatMini = ({ label, value, color }: any) => (
  <div className="grid shrink-0 min-w-[120px]">
    <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest mb-1.5 font-black">{label}</span>
    <span className={`text-sm md:text-lg font-black font-mono tracking-tighter ${color}`}>{value}</span>
    <div className="h-[2px] w-full bg-white/5 mt-2 rounded-full overflow-hidden">
      <div className={`h-full bg-current opacity-40 animate-shimmer`} style={{width: '65%'}}></div>
    </div>
  </div>
);

const Panel = ({ children, label, accent, fill }: any) => (
  <section className={`glass rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 flex flex-col border-white/5 shadow-2xl ${fill ? 'lg:h-full' : ''} bg-slate-900/10`}>
    <h3 className="text-[10px] md:text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full ${accent === 'cyan' ? 'bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]' : accent === 'red' ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-purple-500 shadow-[0_0_10px_purple]'} shadow-lg`}></span>
      {label}
    </h3>
    <div className="flex-1 min-h-0">{children}</div>
  </section>
);

const TelemetryLine = ({ label, value, color }: any) => (
  <div className="grid gap-3">
    <div className="flex justify-between items-end">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-[11px] font-mono font-bold text-white">{(value * 100).toFixed(0)}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_10px_currentColor]`} style={{width: `${value * 100}%`}}></div>
    </div>
  </div>
);

const MetaRow = ({ label, value }: any) => (
  <div className="grid gap-1">
    <span className="text-[8px] font-mono text-slate-700 uppercase font-black tracking-widest">{label}</span>
    <span className="text-xs text-white font-bold truncate tracking-widest uppercase">{value}</span>
  </div>
);

const JudgeRow = ({ name, score, type }: any) => (
  <div className="grid gap-3 group">
    <div className="flex justify-between items-center">
      <div className="grid">
        <div className="text-[7px] font-mono text-slate-700 font-bold uppercase tracking-widest">{type}</div>
        <div className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{name}</div>
      </div>
      <div className={`text-base md:text-xl font-black font-mono tracking-tighter ${score > 0.8 ? 'text-red-500' : 'text-cyan-500'}`}>{score.toFixed(3)}</div>
    </div>
    <div className="grid grid-cols-10 gap-1 h-1.5">
      {Array.from({length: 10}).map((_, i) => (
        <div key={i} className={`rounded-sm transition-all duration-1000 delay-${i*50} ${i < Math.floor(score * 10) ? (score > 0.8 ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-cyan-500 shadow-[0_0_5px_cyan]') : 'bg-white/5'}`}></div>
      ))}
    </div>
  </div>
);

export default SystemMonitor;
