
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
    <div className="h-full w-full flex flex-col bg-[#02040a] overflow-hidden">
      
      {/* 1. HUD SUPERIOR: Sticky y Responsive */}
      <div className="shrink-0 border-b border-white/5 bg-[#02040a]/80 backdrop-blur-3xl z-40 p-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar w-full lg:w-auto">
            <StatMini label="THROUGHPUT" value={`${(data.backend.throughput / 1000).toFixed(1)}k/s`} color="text-cyan-500" />
            <StatMini label="MESH_CONF" value={`${data.pipeline.testCoverage}%`} color="text-emerald-500" />
            <StatMini label="P99_LATENCY" value={`${data.backend.p99Latency.toFixed(2)}ms`} color="text-purple-500" />
          </div>
          
          {!forcedTab && (
            <nav className="inline-flex bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-3xl w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('RISK')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'RISK' ? 'bg-white text-black' : 'text-slate-500'}`}
              >
                Risk_Core
              </button>
              <button 
                onClick={() => setActiveTab('COLLECTIONS')}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'COLLECTIONS' ? 'bg-white text-black' : 'text-slate-500'}`}
              >
                Ops_View
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* 2. ÁREA DE TRABAJO: Grid de 12 Columnas con áreas dinámicas */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 lg:p-12">
        {activeTab === 'RISK' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-10 h-full max-w-[2400px] mx-auto">
            
            {/* IZQUIERDA: Métricas Técnicas */}
            <div className="lg:col-span-3 flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
              <Panel label="Kernel_Vitality" accent="cyan">
                <BackendPulse metrics={data.backend} />
              </Panel>
              
              <Panel label="Cluster_Nodes" accent="purple">
                <div className="grid gap-4">
                  {data.cluster.map(node => (
                    <div key={node.id} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-black text-white font-mono">{node.id}</span>
                         <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${node.status === 'HEALTHY' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>{node.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <ResourceBar label="CPU" val={node.cpu} />
                         <ResourceBar label="MEM" val={node.memory} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            {/* CENTRO: Visualización Neuronal */}
            <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8 order-1 lg:order-2">
               <div className="aspect-square lg:flex-1 bg-black/40 border border-white/5 rounded-[3rem] lg:rounded-[5rem] relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 opacity-40 scale-125">
                    <RiskRadar siprScore={data.siprScore} />
                  </div>
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
                     <span className="text-[10px] md:text-xs font-black tracking-[1em] text-cyan-500 uppercase animate-pulse mb-6">Inference_Engine</span>
                     <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter italic leading-none truncate max-w-full px-4">
                       {data.applicantName}
                     </h2>
                     <div className="mt-12">
                        <div className={`text-6xl md:text-8xl font-black font-mono tracking-tighter ${isCritical ? 'text-red-500' : 'text-cyan-400'}`}>
                          {(data.siprScore * 100).toFixed(1)}%
                        </div>
                        <p className="text-[8px] md:text-[10px] font-mono text-slate-700 uppercase tracking-[0.6em] font-black mt-4">Risk_Index_Score</p>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                 <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-xl">
                    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 font-mono">Build_Integrity</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-600 font-black">VERSION:</span>
                          <span className="text-white font-black truncate max-w-[120px]">{data.pipeline.currentBuild}</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-slate-600 font-black">SECURITY:</span>
                          <span className="text-emerald-500 font-black">{data.pipeline.securityGate}</span>
                       </div>
                       <div className="h-1 w-full bg-slate-900 rounded-full mt-4">
                          <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{width: `${data.pipeline.testCoverage}%`}}></div>
                       </div>
                    </div>
                 </div>
                 <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-xl">
                    <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-6 font-mono">Security_Perimeter</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col">
                          <span className="text-2xl font-black text-white">{data.security.wafBlockedToday}</span>
                          <span className="text-[8px] font-mono text-slate-700 font-black uppercase">Waf_Blocks</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-2xl font-black text-emerald-500">{data.security.mfaCompliance}%</span>
                          <span className="text-[8px] font-mono text-slate-700 font-black uppercase">Mfa_Active</span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* DERECHA: Auditoría y Anomalías */}
            <div className="lg:col-span-3 flex flex-col gap-6 lg:gap-8 order-3">
               <Panel label="Audit_Analytics" accent="cyan">
                  <div className="grid gap-3">
                    {data.services.map(svc => (
                      <div key={svc.name} className="flex justify-between items-center p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                           <div className={`w-1.5 h-1.5 rounded-full ${svc.status === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                           <span className="text-[9px] font-black text-white uppercase tracking-tight">{svc.name}</span>
                        </div>
                        <span className="text-[9px] font-mono text-cyan-500 font-bold">{svc.latency}ms</span>
                      </div>
                    ))}
                  </div>
               </Panel>
               <Panel label="Forensic_Anomalies" accent="red" fill>
                  <div className="h-[400px] lg:h-full min-h-0 overflow-hidden">
                    <ForensicPanel anomalies={data.anomalies} />
                  </div>
               </Panel>
            </div>
          </div>
        ) : (
          <div className="h-full animate-in slide-in-from-right-8 duration-500">
            <CollectionsDashboard cases={data.collections.cases} metrics={data.collections.metrics} />
          </div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const ResourceBar = ({ label, val }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-[8px] font-mono font-black text-slate-700 uppercase">
      <span>{label}</span>
      <span>{val.toFixed(0)}%</span>
    </div>
    <div className="h-1 w-full bg-slate-950 rounded-full overflow-hidden">
      <div className={`h-full transition-all duration-1000 ${val > 80 ? 'bg-red-500' : 'bg-purple-600'}`} style={{width: `${val}%`}}></div>
    </div>
  </div>
);

const StatMini = ({ label, value, color }: any) => (
  <div className="grid shrink-0 min-w-[100px] md:min-w-[140px]">
    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-1 font-black">{label}</span>
    <span className={`text-sm md:text-xl font-black font-mono tracking-tighter ${color}`}>{value}</span>
    <div className="h-[1px] w-full bg-white/5 mt-2"></div>
  </div>
);

const Panel = ({ children, label, accent, fill }: any) => (
  <section className={`glass rounded-[3rem] p-8 flex flex-col border-white/5 shadow-2xl ${fill ? 'lg:h-full' : ''} bg-slate-900/5`}>
    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-3 font-mono italic">
      <span className={`w-2 h-2 rounded-full ${accent === 'cyan' ? 'bg-cyan-500 shadow-[0_0_8px_#06b6d4]' : accent === 'red' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-purple-500'}`}></span>
      {label}
    </h3>
    <div className="flex-1 min-h-0">{children}</div>
  </section>
);

export default SystemMonitor;
