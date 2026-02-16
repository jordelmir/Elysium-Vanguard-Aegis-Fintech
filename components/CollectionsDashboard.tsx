
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
    <div className="min-h-full flex flex-col lg:grid lg:grid-rows-[auto_1fr] gap-6 animate-in fade-in slide-in-from-right-8 duration-700 pb-10 lg:pb-0">
      
      {/* KPI GRID - Scroll horizontal en móvil para evitar columnas ultra-estrechas */}
      <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-x-visible no-scrollbar shrink-0">
        <MetricTile label="Liquidity_Cost" value={`$${metrics.costToCollect.toFixed(3)}`} status="success" />
        <MetricTile label="Net_Recovery" value={`${(metrics.recoveryRate * 100).toFixed(1)}%`} status="neutral" />
        <MetricTile label="Clinical_Cure" value={`${(metrics.cureRate * 100).toFixed(1)}%`} status="success" />
        <MetricTile label="Active_Neural_Bots" value={metrics.activeNegotiations.toString()} status="warning" />
      </div>

      {/* ÁREA DE TRABAJO PRINCIPAL */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:overflow-hidden min-h-0">
        
        {/* NBA QUEUE - Altura fija en móvil para que el Negociador aparezca abajo */}
        <div className="lg:col-span-7 h-[400px] lg:h-full grid grid-rows-[auto_1fr] bg-slate-900/40 border border-white/10 rounded-[2.5rem] p-6 backdrop-blur-xl overflow-hidden shadow-2xl">
           <header className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-3">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_orange]"></span>
                Inference_NBA_Queue
              </h3>
              <span className="text-[10px] font-mono text-slate-700 font-bold uppercase tracking-widest">Cluster_Matrix_V4.2</span>
           </header>
           
           <div className="overflow-y-auto pr-2 custom-scrollbar grid gap-3 content-start">
              {cases.map((c) => (
                <div 
                  key={c.loanId} 
                  onClick={() => setSelectedCase(c)}
                  className={`cursor-pointer p-4 rounded-[1.5rem] grid grid-cols-[auto_1fr_auto] items-center gap-6 transition-all group shadow-sm border ${selectedCase?.loanId === c.loanId ? 'bg-cyan-500/10 border-cyan-500/40 shadow-xl' : 'bg-slate-950/50 border-white/5 hover:border-white/20'}`}
                >
                  <div className={`w-10 h-10 rounded-xl grid place-items-center font-black text-white text-sm ${getClusterColor(c.cluster)} shadow-lg`}>
                    {c.applicantName[0]}
                  </div>
                  <div className="grid overflow-hidden">
                    <div className="text-xs font-black text-white uppercase tracking-wider truncate">{c.applicantName}</div>
                    <div className="text-[9px] font-mono text-slate-600 uppercase flex gap-4">
                      <span>{c.loanId}</span>
                      <span className="text-amber-600/80 font-bold">{c.daysPastDue} DPD</span>
                    </div>
                  </div>

                  <div className="grid text-right justify-items-end">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${getStrategyColor(c.strategy)}`}>
                      {c.strategy.split('_')[0]}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-12 h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className={`h-full ${getProbColor(c.recoveryProbability)}`} style={{width: `${c.recoveryProbability * 100}%`}}></div>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-500">{(c.recoveryProbability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* INTEGRATED NEURAL NEGOTIATOR - Altura mínima garantizada en móvil */}
        <div className="lg:col-span-5 h-[500px] lg:h-full">
           <NeuralNegotiator activeCase={selectedCase} />
        </div>

      </div>
    </div>
  );
};

const MetricTile: React.FC<{ label: string; value: string; status: string }> = ({ label, value, status }) => (
  <div className="bg-slate-900/40 border border-white/5 p-5 rounded-[2rem] backdrop-blur-md grid gap-1 shadow-inner shrink-0 min-w-[140px] lg:min-w-0">
    <div className="text-[8px] font-mono text-slate-600 uppercase tracking-[0.2em]">{label}</div>
    <div className={`text-xl font-black font-mono tracking-tighter ${status === 'success' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-white'}`}>{value}</div>
  </div>
);

const getClusterColor = (cluster: DebtorCluster) => {
  switch (cluster) {
    case DebtorCluster.FORGETFUL: return 'bg-cyan-600';
    case DebtorCluster.ILLIQUID: return 'bg-amber-600';
    case DebtorCluster.NEGLIGENT: return 'bg-purple-600';
    case DebtorCluster.FRAUDULENT: return 'bg-red-600';
    default: return 'bg-slate-600';
  }
};

const getStrategyColor = (strategy: CollectionStrategy) => {
  switch (strategy) {
    case CollectionStrategy.PREVENTIVE_PUSH: return 'text-emerald-400';
    case CollectionStrategy.SOFT_NEGOTIATION: return 'text-cyan-400';
    case CollectionStrategy.HARD_NEGOTIATION: return 'text-amber-400';
    case CollectionStrategy.LEGAL_NUCLEAR: return 'text-red-500 animate-pulse';
    default: return 'text-slate-400';
  }
};

const getProbColor = (p: number) => {
  if (p > 0.8) return 'bg-emerald-500';
  if (p > 0.4) return 'bg-amber-500';
  return 'bg-red-600';
}

export default CollectionsDashboard;
