
import React, { useState } from 'react';
import { CollectionCase, CollectionMetrics, DebtorCluster, CollectionStrategy } from '../types';
import NeuralNegotiator from './NeuralNegotiator';

interface CollectionsDashboardProps {
  cases: CollectionCase[];
  metrics: CollectionMetrics;
}

const CollectionsDashboard: React.FC<CollectionsDashboardProps> = ({ cases, metrics }) => {
  const [selectedCase, setSelectedCase] = useState<CollectionCase | null>(cases[0]);

  return (
    <div className="h-full flex flex-col gap-6 lg:gap-10 animate-in fade-in slide-in-from-right-12 duration-1000">
      
      {/* KPI HUD - Responsive Fluid Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 shrink-0">
        <MetricTile label="Costo_Operativo" value={`$${metrics.costToCollect.toFixed(3)}`} status="success" />
        <MetricTile label="Tasa_Recuperación" value={`${(metrics.recoveryRate * 100).toFixed(1)}%`} status="neutral" />
        <MetricTile label="Cure_Rate" value={`${(metrics.cureRate * 100).toFixed(1)}%`} status="success" />
        <MetricTile label="Bots_Activos" value={metrics.activeNegotiations.toString()} status="warning" />
      </div>

      {/* WORKSPACE MATRIX - Optimized Grid Breakdown */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-10 min-h-0 overflow-hidden">
        
        {/* NBA QUEUE - Left/Top Column */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/40 border border-white/5 rounded-[3rem] p-6 md:p-10 backdrop-blur-2xl overflow-hidden shadow-2xl">
           <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
              <div className="space-y-1">
                <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping shadow-[0_0_15px_orange]"></span>
                  Neural_NBA_Stream
                </h3>
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">Next_Best_Action_Intelligence</p>
              </div>
              <div className="hidden md:block px-4 py-2 bg-white/5 rounded-full text-[10px] font-mono text-slate-500 uppercase tracking-widest border border-white/5">
                Cluster_Matrix_Active
              </div>
           </header>
           
           <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar flex flex-col gap-3 min-h-[300px]">
              {cases.map((c) => (
                <button 
                  key={c.loanId} 
                  onClick={() => setSelectedCase(c)}
                  className={`w-full text-left p-5 rounded-[2rem] grid grid-cols-[auto_1fr_auto] items-center gap-6 transition-all duration-500 border ${selectedCase?.loanId === c.loanId ? 'bg-cyan-500/10 border-cyan-500/40 shadow-xl scale-[1.01]' : 'bg-slate-950/40 border-white/5 hover:bg-white/[0.03] hover:border-white/10'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg ${getClusterColor(c.cluster)} shadow-2xl`}>
                    {c.applicantName[0]}
                  </div>
                  
                  <div className="grid overflow-hidden">
                    <div className="text-sm font-black text-white uppercase tracking-tight truncate">{c.applicantName}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-[9px] font-mono text-slate-600 uppercase font-black">{c.loanId}</span>
                      <span className="text-[10px] text-amber-500 font-black tracking-widest">{c.daysPastDue} DPD</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-white/5 ${getStrategyColor(c.strategy)}`}>
                      {c.strategy.split('_')[0]}
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-mono font-black text-slate-500">{(c.recoveryProbability * 100).toFixed(0)}%</span>
                       <div className="w-16 h-1 bg-slate-900 rounded-full overflow-hidden shadow-inner">
                         <div className={`h-full ${getProbColor(c.recoveryProbability)} transition-all duration-1000 shadow-[0_0_5px_currentColor]`} style={{width: `${c.recoveryProbability * 100}%`}}></div>
                       </div>
                    </div>
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* NEURAL NEGOTIATOR - Right/Bottom Column */}
        <div className="lg:col-span-5 h-[550px] lg:h-full min-h-[450px]">
           <NeuralNegotiator activeCase={selectedCase} />
        </div>

      </div>
    </div>
  );
};

const MetricTile: React.FC<{ label: string; value: string; status: string }> = ({ label, value, status }) => (
  <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[2.5rem] backdrop-blur-md grid gap-1.5 shadow-inner group hover:bg-white/5 transition-all">
    <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black group-hover:text-slate-400 transition-colors">{label}</div>
    <div className={`text-2xl md:text-3xl font-black font-mono tracking-tighter ${status === 'success' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-white'}`}>{value}</div>
    <div className="h-1 w-12 bg-white/5 mt-1 rounded-full overflow-hidden">
       <div className={`h-full opacity-50 transition-all duration-1000 ${status === 'success' ? 'bg-emerald-500' : 'bg-current'}`} style={{width: '70%'}}></div>
    </div>
  </div>
);

const getClusterColor = (cluster: DebtorCluster) => {
  switch (cluster) {
    case DebtorCluster.FORGETFUL: return 'bg-cyan-600';
    case DebtorCluster.ILLIQUID: return 'bg-amber-600';
    case DebtorCluster.NEGLIGENT: return 'bg-purple-600';
    case DebtorCluster.FRAUDULENT: return 'bg-red-600 shadow-[0_0_20px_rgba(255,0,0,0.3)]';
    default: return 'bg-slate-600';
  }
};

const getStrategyColor = (strategy: CollectionStrategy) => {
  switch (strategy) {
    case CollectionStrategy.PREVENTIVE_PUSH: return 'text-emerald-400';
    case CollectionStrategy.SOFT_NEGOTIATION: return 'text-cyan-400';
    case CollectionStrategy.HARD_NEGOTIATION: return 'text-amber-400';
    case CollectionStrategy.LEGAL_NUCLEAR: return 'text-red-500 animate-pulse font-black';
    default: return 'text-slate-400';
  }
};

const getProbColor = (p: number) => {
  if (p > 0.8) return 'bg-emerald-500';
  if (p > 0.4) return 'bg-amber-500';
  return 'bg-red-600';
}

export default CollectionsDashboard;
