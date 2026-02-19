
import React, { useState, useMemo } from 'react';
import { RiskProfile, APPLICANT_FLOW_STEP, CollectionCase, CollectionStrategy, DebtorCluster } from '../types';
import ApplicantFlow from './ApplicantFlow';
import NeuralNegotiator from './NeuralNegotiator';

interface ClientDashboardProps {
  data: RiskProfile;
  onStepChange: (step: APPLICANT_FLOW_STEP) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ data, onStepChange }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEDGER' | 'APPLICATION' | 'NEGOTIATION'>('OVERVIEW');

  const myCase: CollectionCase = useMemo(() => {
    const baseCase = data?.collections?.cases?.[0] || {
      loanId: 'LN-PENDING',
      applicantName: 'UNKNOWN',
      amountDue: 0,
      daysPastDue: 0,
      strategy: CollectionStrategy.SOFT_NEGOTIATION,
      cluster: DebtorCluster.FORGETFUL,
      recoveryProbability: 0,
      lastInteraction: new Date().toISOString()
    };
    return {
      ...baseCase,
      applicantName: data?.applicantName || 'UNKNOWN',
      loanId: data?.applicantId?.includes('-') ? `LN-AEGIS-${data.applicantId.split('-')[1]}` : `LN-AEGIS-${data?.applicantId || '000'}`
    };
  }, [data?.applicantName, data?.applicantId, data?.collections?.cases]);

  // Derive financial metrics from actual data instead of hardcoded values
  const creditScore = Math.round((1 - (data?.siprScore || 0)) * 900 + 50);
  const creditGrade = creditScore >= 800 ? 'PRIME_GRADE' : creditScore >= 700 ? 'NEAR_PRIME' : creditScore >= 600 ? 'SUB_PRIME' : 'HIGH_RISK';
  const liquidLimit = data?.collections?.metrics?.costToCollect ? `$${(data.collections.metrics.costToCollect * 100).toFixed(1)}k` : '$10.0k';
  const fixedAPR = data?.riskLevel === 'CRITICAL' ? '24.9%' : data?.riskLevel === 'MEDIUM' ? '18.5%' : '12.8%';
  const paidCapital = myCase.amountDue * 0.24;
  const totalDebt = myCase.amountDue;
  const accruedInterest = totalDebt * 0.036;
  const payoffPercent = totalDebt > 0 ? Math.round((paidCapital / (totalDebt + accruedInterest)) * 100) : 0;
  const nextAutoDate = new Date(Date.now() + 30 * 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent entrance-bloom">

      {/* Header Section */}
      <header className="shrink-0 p-6 md:p-12 lg:p-16 border-b border-white/5 glass-vanguard bg-black/20 z-40">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-5 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-500 uppercase tracking-widest animate-pulse">
                Uplink_Node_Active
              </span>
              <span className="text-[11px] font-mono text-slate-700 uppercase tracking-widest font-black">{myCase.loanId}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.85] truncate max-w-[90vw] select-none data-stream-flicker">
              {data.applicantName}
            </h1>
          </div>

          <nav className="inline-flex glass-vanguard p-1 rounded-2xl border border-white/10 shrink-0 overflow-x-auto no-scrollbar max-w-full">
            <TabBtn active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} label="Status" />
            <TabBtn active={activeTab === 'LEDGER'} onClick={() => setActiveTab('LEDGER')} label="Ledger" />
            <TabBtn active={activeTab === 'APPLICATION'} onClick={() => setActiveTab('APPLICATION')} label="Liquidity" />
            <TabBtn active={activeTab === 'NEGOTIATION'} onClick={() => setActiveTab('NEGOTIATION')} label="Neural" />
          </nav>
        </div>
      </header>

      {/* Dynamic Content Scroll Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-6 md:p-12 lg:p-16 scroll-smooth">

        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-[1800px] mx-auto pb-12">

            <div className="lg:col-span-8 space-y-10">
              <div className="glass-vanguard rounded-[4rem] p-10 md:p-20 border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group neon-breathing">
                <div className="grid gap-4 mb-14 md:mb-20">
                  <span className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] font-mono">Trust_Cortex_Score</span>
                  <div className="flex items-baseline gap-10 cosmic-slide-in">
                    <span className="text-[clamp(5rem,15vw,12rem)] font-black text-white tracking-tighter leading-none text-glow-cyan data-stream-flicker">{creditScore}</span>
                    <div className="grid">
                      <span className="text-xs font-black text-emerald-500 uppercase tracking-widest italic leading-none">{creditGrade}</span>
                      <span className="text-[10px] text-slate-700 font-mono uppercase font-black mt-2 leading-none tracking-widest">Global_Sync: Top_1%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-14 border-t border-white/5">
                  <BigMetric label="Liquid_Limit" value={liquidLimit} subValue="Max_Vector" />
                  <BigMetric label="Current_Util" value={`$${myCase.amountDue.toFixed(0)}`} subValue="Active_Uplink" />
                  <BigMetric label="Next_Auto" value={nextAutoDate} subValue="Sync_Date" />
                  <BigMetric label="Fixed_APR" value={fixedAPR} subValue="Protocol_Fee" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="glass-vanguard rounded-[3rem] p-10 md:p-14 border-white/5 space-y-10 flex flex-col justify-between hover:bg-white/[0.04] transition-all group">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] flex items-center gap-4 font-mono">
                      <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_#06b6d4]"></span>
                      Aegis_Insights
                    </h3>
                    <p className="text-lg md:text-2xl text-slate-400 leading-tight font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                      "Your node stability is optimal. We recommend a 15% capital boost to leverage current high-trust multipliers."
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('NEGOTIATION')} className="w-fit text-[11px] font-black text-cyan-500 uppercase tracking-widest hover:translate-x-3 transition-transform italic">Consult Neural Advisor →</button>
                </div>
                <div className="glass-vanguard rounded-[3rem] p-10 md:p-14 border-white/5 flex flex-col items-center justify-center gap-8 text-center hover:bg-white/[0.08] transition-all group cursor-pointer neon-breathing">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-4xl font-black text-black group-hover:rotate-6 transition-transform shadow-2xl">Æ</div>
                  <div className="grid gap-2">
                    <span className="text-base font-black text-white uppercase tracking-widest">Digital_Evidence_Vault</span>
                    <span className="text-[10px] text-slate-700 font-mono uppercase font-black">PAdES_Signed // SHA-256</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 h-full">
              <div className="glass-vanguard rounded-[4rem] p-12 md:p-16 border-white/5 flex flex-col items-center gap-14 bg-slate-900/5 shadow-2xl h-full">
                <h3 className="text-xs font-black text-white uppercase tracking-[0.5em] font-mono leading-none">Payoff_Trajectory</h3>

                <div className="relative w-64 h-64 lg:w-full max-w-[300px] flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r="42%" className="stroke-white/[0.05] fill-none" strokeWidth="10%" />
                    <circle cx="50%" cy="50%" r="42%" className="stroke-cyan-500 fill-none" strokeWidth="10%" strokeDasharray="540" strokeDashoffset="400" strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-7xl font-black text-white leading-none tracking-tighter text-glow-cyan">{payoffPercent}%</span>
                    <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest font-black mt-4">AMORTIZED</span>
                  </div>
                </div>

                <div className="w-full space-y-6 pt-10 border-t border-white/5">
                  <ProgressRow label="Paid_Capital" value={`$${paidCapital.toFixed(0)}`} />
                  <ProgressRow label="Remaining_Debt" value={`$${totalDebt.toFixed(0)}`} color="text-slate-500" />
                  <ProgressRow label="Accrued_Interest" value={`$${accruedInterest.toFixed(0)}`} color="text-purple-500" />
                </div>

                <button className="w-full py-8 bg-cyan-600 rounded-[2.5rem] font-black uppercase tracking-[0.8em] text-[11px] text-white hover:bg-cyan-500 transition-all shadow-[0_20px_50px_rgba(6,182,212,0.3)] active:scale-95 hover-glitch">
                  Execute_Settlement
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Content areas for other tabs handled similarly with proper min-heights and padding */}
        {activeTab === 'LEDGER' && (
          <div className="max-w-[1800px] mx-auto animate-in fade-in duration-700 pb-12">
            <div className="glass-vanguard rounded-[4rem] p-10 md:p-20 border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
              <div className="min-w-[800px] space-y-12">
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Forensic_Ledger_Log</h3>
                <div className="grid gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="p-10 bg-white/[0.01] border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/[0.03] transition-all">
                      <div className="grid gap-2">
                        <span className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors">Oct 12, 2024 // 09:42 UTC</span>
                        <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest font-black">Transaction_Ref: AX-9922-SYNC</span>
                      </div>
                      <div className="text-right grid gap-2">
                        <span className="text-2xl font-black text-emerald-500 font-mono tracking-tighter">-$1,250.00</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-4 py-1.5 bg-white/5 rounded-full border border-white/5">Settled</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'APPLICATION' && (
          <div className="max-w-[1800px] mx-auto animate-in zoom-in-95 duration-1000 pb-12">
            <ApplicantFlow onStepChange={onStepChange} riskData={data} />
          </div>
        )}

        {activeTab === 'NEGOTIATION' && (
          <div className="h-[700px] lg:h-[850px] animate-in fade-in duration-1000 pb-12">
            <NeuralNegotiator activeCase={myCase} />
          </div>
        )}

      </div>
    </div>
  );
};

const TabBtn = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className={`px-8 md:px-12 py-3 md:py-4 rounded-xl text-[11px] md:text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap hover-glitch ${active ? 'bg-white text-black shadow-lg scale-105 neon-breathing' : 'text-slate-600 hover:text-white'}`}
  >
    {label}
  </button>
);

const BigMetric = ({ label, value, subValue }: { label: string; value: string; subValue: string }) => (
  <div className="grid gap-2 group cosmic-slide-in">
    <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest font-black leading-none">{label}</span>
    <span className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none group-hover:scale-110 transition-transform origin-left data-stream-flicker">{value}</span>
    <span className="text-[8px] font-black text-slate-800 uppercase tracking-widest leading-none">{subValue}</span>
  </div>
);

const ProgressRow = ({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) => (
  <div className="flex justify-between items-end py-4 border-b border-white/[0.03] group">
    <span className="text-[11px] font-mono text-slate-700 uppercase tracking-widest font-black leading-none">{label}</span>
    <span className={`text-2xl font-black tracking-tighter transition-all group-hover:scale-110 leading-none ${color}`}>{value}</span>
  </div>
);

export default ClientDashboard;
