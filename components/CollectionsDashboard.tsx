
import React, { useState } from 'react';
import { CollectionCase, CollectionMetrics, DebtorCluster, CollectionStrategy } from '../types';
import NeuralNegotiator from './NeuralNegotiator';

interface CollectionsDashboardProps {
  cases: CollectionCase[];
  metrics: CollectionMetrics;
}

const CollectionsDashboard: React.FC<CollectionsDashboardProps> = ({ cases = [], metrics }) => {
  const [selectedCase, setSelectedCase] = useState<CollectionCase | null>(cases?.[0] || null);

  const safeMetrics = {
    costToCollect: metrics?.costToCollect || 0,
    recoveryRate: metrics?.recoveryRate || 0,
    cureRate: metrics?.cureRate || 0,
    activeNegotiations: metrics?.activeNegotiations || 0
  };

  return (
    <div className="h-full flex flex-col gap-8 lg:gap-10 animate-in fade-in slide-in-from-right-12 duration-1000 entrance-bloom">

      {/* KPI HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 shrink-0 cosmic-slide-in">
        <MetricTile label="Op_Cost" value={`$${safeMetrics.costToCollect.toFixed(3)}`} status="success" />
        <MetricTile label="Recovery" value={`${(safeMetrics.recoveryRate * 100).toFixed(1)}%`} status="neutral" />
        <MetricTile label="Cure_Rate" value={`${(safeMetrics.cureRate * 100).toFixed(1)}%`} status="success" />
        <MetricTile label="Active_Bots" value={safeMetrics.activeNegotiations.toString()} status="warning" />
      </div>

      {/* WORKSPACE MATRIX - Ajustado para no cortarse en móvil */}
      <div className="flex-none lg:flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-10 min-h-0 lg:overflow-hidden">

        {/* NBA QUEUE */}
        <div className="lg:col-span-7 flex flex-col glass-vanguard bg-black/40 border border-white/5 rounded-[3rem] p-6 md:p-10 lg:overflow-hidden shadow-2xl neon-breathing">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/5 pb-6">
            <div className="space-y-1">
              <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping shadow-[0_0_15px_orange]"></span>
                Neural_NBA_Stream
              </h3>
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-full text-[9px] font-mono text-slate-500 uppercase tracking-widest border border-white/5">
              Cluster_Matrix_Active
            </div>
          </header>

          <div className="lg:flex-1 lg:overflow-y-auto no-scrollbar flex flex-col gap-3 min-h-[400px]">
            {cases.map((c) => (
              <button
                key={c.loanId}
                onClick={() => setSelectedCase(c)}
                className={`w-full text-left p-5 rounded-[2rem] grid grid-cols-[auto_1fr_auto] items-center gap-6 transition-all duration-500 border hover-glitch ${selectedCase?.loanId === c.loanId ? 'bg-cyan-500/10 border-cyan-500/40 shadow-xl scale-[1.01] neon-breathing' : 'glass-vanguard bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'}`}
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
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* NEURAL NEGOTIATOR */}
        <div className="lg:col-span-5 h-[600px] lg:h-full">
          <NeuralNegotiator activeCase={selectedCase} />
        </div>

      </div>
    </div>
  );
};

const MetricTile: React.FC<{ label: string; value: string; status: string }> = ({ label, value, status }) => (
  <div className="glass-vanguard bg-black/40 border border-white/5 p-5 md:p-6 rounded-[2.5rem] grid gap-1 shadow-inner group hover:bg-white/5 transition-all neon-breathing">
    <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">{label}</div>
    <div className={`text-xl md:text-3xl font-black font-mono tracking-tighter data-stream-flicker ${status === 'success' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-white'}`}>{value}</div>
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

export default CollectionsDashboard;
