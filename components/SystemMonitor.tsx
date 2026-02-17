
import React, { useState, useEffect } from 'react';
import { RiskProfile, RiskLevel, APPLICANT_FLOW_STEP } from '../types';
import { bioSocket, SUBJECTS } from '../services/mockSocketService';
import RiskRadar from './RiskRadar';
import BackendPulse from './BackendPulse';
import ForensicPanel from './ForensicPanel';
import CollectionsDashboard from './CollectionsDashboard';

interface SystemMonitorProps {
  data: RiskProfile;
  activeUserStep: APPLICANT_FLOW_STEP;
  forcedTab?: 'RISK' | 'COLLECTIONS' | 'REGISTRY';
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ data, activeUserStep, forcedTab }) => {
  const [activeTab, setActiveTab] = useState<'RISK' | 'COLLECTIONS' | 'REGISTRY'>(forcedTab || 'RISK');

  useEffect(() => {
    if (forcedTab) setActiveTab(forcedTab);
  }, [forcedTab]);

  const isCritical = data?.riskLevel === RiskLevel.CRITICAL;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#02040a]">

      {/* HUD Navigation Strip */}
      <div className="shrink-0 px-4 md:px-16 lg:px-24 xl:px-32 py-4 md:py-8 border-b border-white/5 bg-black/40 backdrop-blur-3xl z-40">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">
          <div className="flex gap-8 md:gap-12 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <StatMini label="THROUGHPUT" value={`${((data?.backend?.throughput || 0) / 1000).toFixed(1)}k/s`} color="text-cyan-500" />
            <StatMini label="MESH_CONF" value={`${data?.pipeline?.testCoverage || 0}%`} color="text-emerald-500" />
            <StatMini label="LATENCY_P99" value={`${(data?.backend?.p99Latency || 0).toFixed(2)}ms`} color="text-purple-500" />
          </div>

          <nav className="inline-flex bg-white/5 p-1 rounded-2xl border border-white/5 shrink-0">
            <NavBtn active={activeTab === 'RISK'} onClick={() => setActiveTab('RISK')} label="Risk_Cortex" />
            <NavBtn active={activeTab === 'COLLECTIONS'} onClick={() => setActiveTab('COLLECTIONS')} label="Operations" />
            <NavBtn active={activeTab === 'REGISTRY'} onClick={() => setActiveTab('REGISTRY')} label="Subject_List" />
          </nav>
        </div>
      </div>

      {/* Main Content Scroll Container - pb-32 para evitar cortes */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-16 lg:px-24 xl:px-40 py-8 md:py-16 scroll-smooth bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.05)_0%,_transparent_60%)]">

        {activeTab === 'RISK' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 max-w-[2400px] mx-auto pb-32">

            {/* GRID AREA: METRICS (3 COL) */}
            <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
              <Panel label="Kernel_Vitality" accent="cyan">
                <BackendPulse metrics={data?.backend} />
              </Panel>
              <Panel label="Cluster_Infrastructure" accent="purple">
                <div className="space-y-4">
                  {(data?.cluster || []).map(node => (
                    <div key={node.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:border-purple-500/30 transition-all">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-white font-mono">{node.id}</span>
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${node.status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{node.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <ResourceBar label="CPU" val={node.cpu} />
                        <ResourceBar label="MEM" val={node.memory} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            {/* GRID AREA: NEURAL INFERENCE SCAN (6 COL) */}
            <div className="lg:col-span-6 flex flex-col gap-8 lg:gap-16 order-1 lg:order-2">
              <div className="relative w-full group">
                <div className="relative aspect-square sm:aspect-video lg:aspect-auto lg:h-[650px] w-full bg-black/60 border border-white/10 rounded-[3rem] md:rounded-[6rem] overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-1000">
                    <RiskRadar siprScore={data?.siprScore || 0} />
                  </div>
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 md:p-10 text-center pointer-events-none">
                    <div className="flex flex-col items-center gap-3 mb-6">
                      <span className="text-[9px] md:text-xs font-black tracking-[1em] text-cyan-500 uppercase animate-pulse">Neural_Inference_Scan</span>
                      <div className="h-[1px] w-16 bg-cyan-500/30"></div>
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-white tracking-tighter italic leading-tight px-4 truncate w-full">
                      {data?.applicantName || 'INITIALIZING...'}
                    </h2>
                    <div className="mt-8 md:mt-12 flex flex-col items-center">
                      <div className={`text-6xl md:text-8xl xl:text-9xl font-black font-mono tracking-tighter leading-none ${isCritical ? 'text-red-500' : 'text-cyan-400'}`}>
                        {((data?.siprScore || 0) * 100).toFixed(1)}%
                      </div>
                      <p className="text-[9px] md:text-[10px] font-mono text-slate-700 uppercase tracking-[0.6em] font-black mt-4">Composite_Risk_Matrix</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Panel label="Protocol_Integrity" accent="emerald">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-slate-600 font-bold uppercase">BUILD_HASH</span>
                      <span className="text-white font-black truncate max-w-[120px]">{data?.pipeline?.currentBuild || 'N/A'}</span>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-[9px] font-mono text-slate-700 font-black">
                        <span>TEST_COVERAGE</span>
                        <span>{data?.pipeline?.testCoverage || 0}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: `${data?.pipeline?.testCoverage || 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </Panel>
                <Panel label="Security_Gate" accent="cyan">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-white tracking-tighter">{(data?.security?.wafBlockedToday || 0).toLocaleString()}</span>
                      <span className="text-[9px] font-mono text-slate-700 font-black uppercase tracking-widest mt-1">Intercepts</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-emerald-500 tracking-tighter">{data?.security?.mfaCompliance || 0}%</span>
                      <span className="text-[9px] font-mono text-slate-700 font-black uppercase tracking-widest mt-1">Compliance</span>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>

            {/* GRID AREA: FORENSICS (3 COL) */}
            <div className="lg:col-span-3 space-y-8 order-3">
              <Panel label="Service_Orchestration" accent="cyan">
                <div className="grid gap-4">
                  {(data?.services || []).map(svc => (
                    <div key={svc.name} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${svc.status === 'UP' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{svc.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-500 font-bold">{svc.latency}ms</span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel label="Forensic_Anomalies" accent="red">
                <div className="min-h-[400px] lg:flex-1">
                  <ForensicPanel anomalies={data?.anomalies || []} />
                </div>
              </Panel>
            </div>
          </div>
        )}

        {activeTab === 'COLLECTIONS' && (
          <div className="max-w-[2000px] mx-auto animate-in fade-in duration-500 pb-32">
            <CollectionsDashboard cases={data?.collections?.cases || []} metrics={data?.collections?.metrics} />
          </div>
        )}

        {activeTab === 'REGISTRY' && (
          <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-32">
            <header className="mb-12 text-center">
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none mb-4">Subject_Node_Registry</h3>
              <p className="text-slate-600 font-mono text-[10px] md:text-xs uppercase tracking-[0.5em] font-black">Authorized_Access_Only // Protocol_Level_Root</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {SUBJECTS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    bioSocket.selectSubject(sub.id);
                    setActiveTab('RISK');
                  }}
                  className={`group relative p-10 bg-white/[0.02] border border-white/10 rounded-[3rem] text-left transition-all hover:bg-white/[0.05] hover:border-cyan-500/50 hover:-translate-y-2 overflow-hidden ${data.applicantId === sub.id ? 'border-cyan-500/50 bg-cyan-500/5 ring-1 ring-cyan-500/20' : ''}`}
                >
                  <div className={`absolute -right-12 -bottom-12 w-32 h-32 rounded-full blur-[60px] opacity-10 transition-all group-hover:opacity-30 ${sub.name === 'SARAH CONNOR' ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                  <div className="flex items-center gap-6 mb-10">
                    <div className={`w-20 h-20 rounded-[1.8rem] flex items-center justify-center font-black text-3xl shadow-xl transition-all ${sub.name === 'SARAH CONNOR' ? 'bg-red-600 text-white' : 'bg-slate-800 text-cyan-400'}`}>
                      {sub.name[0]}
                    </div>
                    <div className="grid">
                      <span className="text-[11px] font-mono text-slate-700 uppercase tracking-widest font-black mb-1">{sub.id}</span>
                      <span className="text-2xl font-black text-white tracking-tighter uppercase leading-none">{sub.name}</span>
                    </div>
                  </div>
                  <div className="grid gap-5 pt-8 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-mono font-black uppercase tracking-widest">
                      <span className="text-slate-800">Risk_Tier</span>
                      <span className={sub.name === 'SARAH CONNOR' ? 'text-red-500' : 'text-emerald-500'}>{sub.name === 'SARAH CONNOR' ? 'CRITICAL' : 'SECURE'}</span>
                    </div>
                  </div>
                  <div className="mt-10 flex justify-end">
                    <span className="text-[11px] font-black text-cyan-500 uppercase tracking-widest group-hover:translate-x-3 transition-transform italic">Focus_Node →</span>
                  </div>
                </button>
              ))}
            </div>
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

const NavBtn = ({ active, onClick, label }: any) => (
  <button
    onClick={onClick}
    className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-500 hover:text-white'}`}
  >
    {label}
  </button>
);

const StatMini = ({ label, value, color }: any) => (
  <div className="grid shrink-0 min-w-[120px]">
    <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest mb-1 font-black leading-none">{label}</span>
    <span className={`text-xl font-black font-mono tracking-tighter leading-none ${color}`}>{value}</span>
    <div className="h-[1px] w-full bg-white/5 mt-3"></div>
  </div>
);

const ResourceBar = ({ label, val }: any) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between text-[8px] font-mono font-black text-slate-700 uppercase tracking-widest leading-none">
      <span>{label}</span>
      <span>{val.toFixed(0)}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden shadow-inner">
      <div className={`h-full transition-all duration-1000 ${val > 80 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-purple-600'}`} style={{ width: `${val}%` }}></div>
    </div>
  </div>
);

const Panel = ({ children, label, accent }: any) => (
  <section className={`glass rounded-[3rem] p-8 md:p-10 flex flex-col border-white/5 shadow-2xl bg-slate-900/10`}>
    <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 md:mb-10 flex items-center gap-4 font-mono italic shrink-0">
      <span className={`w-2 h-2 rounded-full ${accent === 'cyan' ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : accent === 'red' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-purple-500'}`}></span>
      {label}
    </h3>
    <div className="flex-1 min-h-0">{children}</div>
  </section>
);

export default SystemMonitor;
