
import React from 'react';
import { CollectionCase, CollectionMetrics, DebtorCluster, CollectionStrategy } from '../types';

interface CollectionsDashboardProps {
  cases: CollectionCase[];
  metrics: CollectionMetrics;
}

const CollectionsDashboard: React.FC<CollectionsDashboardProps> = ({ cases, metrics }) => {
  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-right-8 duration-700">
      
      {/* 1. KPI HUD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricTile label="Cost to Collect" value={`$${metrics.costToCollect.toFixed(3)}`} status="success" />
        <MetricTile label="Recovery Rate" value={`${(metrics.recoveryRate * 100).toFixed(1)}%`} status="neutral" />
        <MetricTile label="Cure Rate" value={`${(metrics.cureRate * 100).toFixed(1)}%`} status="success" />
        <MetricTile label="AI Negotiating" value={metrics.activeNegotiations.toString()} status="warning" />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        
        {/* 2. NBA ENGINE FEED (Cases) */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900/40 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
           <header className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                NBA_STRATEGY_QUEUE
              </h3>
              <span className="text-[10px] font-mono text-slate-600">CLUSTER_BATCH_V4</span>
           </header>
           
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {cases.map((c) => (
                <div key={c.loanId} className="bg-slate-950/50 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xs ${getClusterColor(c.cluster)}`}>
                      {c.applicantName[0]}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white uppercase tracking-wider">{c.applicantName}</div>
                      <div className="text-[9px] font-mono text-slate-600 uppercase">{c.loanId} • {c.daysPastDue} DPD</div>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-600 uppercase mb-1">Recovery_Prob</span>
                    <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${getProbColor(c.recoveryProbability)}`} style={{width: `${c.recoveryProbability * 100}%`}}></div>
                    </div>
                    <span className="text-[9px] font-mono font-bold mt-1">{(c.recoveryProbability * 100).toFixed(0)}%</span>
                  </div>

                  <div className="text-right">
                    <div className={`text-[10px] font-black uppercase tracking-widest ${getStrategyColor(c.strategy)}`}>{c.strategy}</div>
                    <div className="text-[8px] font-mono text-slate-500 italic mt-1 truncate max-w-[150px]">{c.lastInteraction}</div>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* 3. AI NEGOTIATOR TERMINAL */}
        <div className="lg:col-span-4 flex flex-col bg-black/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
           <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-4">COGNITIVE_NEGOTIATOR</h3>
           
           <div className="flex-1 font-mono text-[9px] text-slate-400 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <div className="border-l-2 border-emerald-500/30 pl-3">
                <span className="text-emerald-500 block mb-1">AI_SYSTEM: [14:02]</span>
                "Detectado patrón de ingresos vía Open Banking. Ejecutando estrategia PREVENTIVE_PUSH para usuario 'ELON V. MASK'."
              </div>
              <div className="border-l-2 border-cyan-500/30 pl-3">
                <span className="text-cyan-500 block mb-1">AI_BOT: [14:05]</span>
                "Hola Elon, notamos que recibiste tu capital hoy. ¿Quieres asegurar tu historial congelando la cuota de $120 ahora? Responde YES para proteger tu score."
              </div>
              <div className="border-l-2 border-slate-700 pl-3">
                <span className="text-slate-200 block mb-1">USER_REPLY: [14:06]</span>
                "YES. Please do."
              </div>
              <div className="border-l-2 border-emerald-500/30 pl-3">
                <span className="text-emerald-500 block mb-1">AI_SYSTEM: [14:07]</span>
                "Transacción asegurada. Pagaré firmado digitalmente actualizado con sello de pago parcial. RR_INDEX incrementado en +0.15."
              </div>
              <div className="animate-pulse text-cyan-500">>> LISTENING_FOR_NEXT_EVENT...</div>
           </div>

           <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2 text-[8px] font-mono uppercase text-slate-600">
              <div>LLM_MODEL: GPT-4-FINE-TUNED</div>
              <div className="text-right">SENTIMENT: EMPATHETIC_FIRM</div>
           </div>
        </div>

      </div>
    </div>
  );
};

const MetricTile: React.FC<{ label: string; value: string; status: string }> = ({ label, value, status }) => (
  <div className="bg-slate-900/60 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-xl font-black font-mono ${status === 'success' ? 'text-emerald-400' : status === 'warning' ? 'text-amber-400' : 'text-white'}`}>{value}</div>
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
