
import React, { useState, useMemo } from 'react';
import { RiskProfile, APPLICANT_FLOW_STEP, CollectionCase } from '../types';
import ApplicantFlow from './ApplicantFlow';
import NeuralNegotiator from './NeuralNegotiator';

interface ClientDashboardProps {
  data: RiskProfile;
  onStepChange: (step: APPLICANT_FLOW_STEP) => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ data, onStepChange }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'LEDGER' | 'APPLICATION' | 'NEGOTIATION'>('OVERVIEW');

  const myCase: CollectionCase = useMemo(() => {
    const baseCase = data.collections.cases[0];
    return {
      ...baseCase,
      applicantName: data.applicantName,
      loanId: `LN-AEGIS-${data.applicantId.split('-')[1]}`
    };
  }, [data.applicantName, data.applicantId, data.collections.cases]);

  const financialDetails = {
    totalLoan: 15000,
    paidPrincipal: 2500,
    remainingPrincipal: 12500,
    accruedInterest: 450,
    nextPaymentDate: "2024-10-24",
    installments: "03/12",
    apr: "14.85%"
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 md:gap-8 p-4 md:p-8 lg:p-12 overflow-hidden bg-[#02040a]">
      
      {/* HEADER: Identity & Navigation - Optimized for wrapping */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 shrink-0 border-b border-white/5 pb-6 md:pb-10">
        <div className="space-y-4 w-full xl:w-auto">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[9px] font-black text-cyan-500 uppercase tracking-widest animate-pulse">
              Node_Active // Secure_Uplink
            </span>
            <span className="text-[10px] font-mono text-slate-700 uppercase">{myCase.loanId}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase italic leading-none truncate">
            {data.applicantName}
          </h1>
        </div>

        <nav className="w-full xl:w-auto overflow-x-auto no-scrollbar pb-2 xl:pb-0">
          <div className="inline-flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-3xl shrink-0 min-w-max">
            <TabBtn active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} label="Overview" />
            <TabBtn active={activeTab === 'LEDGER'} onClick={() => setActiveTab('LEDGER')} label="Ledger" />
            <TabBtn active={activeTab === 'APPLICATION'} onClick={() => setActiveTab('APPLICATION')} label="Apply Now" />
            <TabBtn active={activeTab === 'NEGOTIATION'} onClick={() => setActiveTab('NEGOTIATION')} label="Advisor" />
          </div>
        </nav>
      </header>

      {/* VIEWPORT CONTENIDO - Responsive Scroll Control */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-12">
        
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            
            {/* Main Stats Card Cluster */}
            <div className="lg:col-span-8 flex flex-col gap-6 md:gap-10 order-1">
              <div className="glass rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 border-white/5 shadow-3xl relative overflow-hidden bg-gradient-to-br from-slate-900 to-black group">
                {/* Decorative Icon - Hidden on mobile for space */}
                <div className="absolute top-0 right-0 p-12 hidden md:block">
                  <div className="w-20 h-20 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 flex items-center justify-center text-emerald-500 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                </div>

                <div className="grid gap-2 mb-10 md:mb-14">
                   <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Sovereign_Credit_Score</span>
                   <div className="flex flex-wrap items-baseline gap-4 md:gap-6">
                     <span className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none">842</span>
                     <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-black text-emerald-500 uppercase tracking-[0.2em]">Aegis_Grade: Prime</span>
                        <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Global_Tier_01</span>
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-white/5 pt-10">
                   <BigMetric label="Available" value="$12.5k" subValue="USD" />
                   <BigMetric label="Utilized" value={`$${myCase.amountDue}`} subValue="14% Active" />
                   <BigMetric label="Next Payment" value="Oct 24" subValue="Automated" />
                   <BigMetric label="APR" value={financialDetails.apr} subValue="Fixed Rate" />
                </div>
              </div>

              {/* Action Grid - Responsive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="glass rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border-white/5 space-y-6 flex flex-col justify-between">
                   <div className="space-y-4">
                     <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></span>
                       AI_Risk_Intelligence
                     </h3>
                     <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium italic">
                       "Your financial health is optimal. Aegis recommends a 15% credit line increase to further strengthen your history."
                     </p>
                   </div>
                   <button onClick={() => setActiveTab('NEGOTIATION')} className="w-fit text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:translate-x-2 transition-transform">Consult Advisor →</button>
                </div>
                <div className="glass rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border-white/5 flex flex-col justify-center items-center gap-5 text-center group cursor-pointer hover:bg-white/5 transition-all">
                   <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-2xl">Æ</div>
                   <div className="grid gap-1">
                      <span className="text-xs font-black text-white uppercase tracking-tighter">Download Audit Ledger</span>
                      <span className="text-[9px] text-slate-600 font-mono uppercase">Vault_Secure // PAdES v2</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Payoff Progress Sidebar - Responsive Priority */}
            <div className="lg:col-span-4 space-y-8 order-2 lg:order-2">
               <div className="glass rounded-[3rem] p-8 md:p-12 border-white/5 flex flex-col items-center gap-8 relative overflow-hidden bg-slate-900/20 shadow-2xl">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest w-full">Recovery_Dynamics</h3>
                  
                  {/* Circular Progress Adaptive Size */}
                  <div className="relative w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="50%" cy="50%" r="40%" className="stroke-white/5 fill-none" strokeWidth="8%" />
                      <circle cx="50%" cy="50%" r="40%" className="stroke-cyan-500 fill-none" strokeWidth="8%" strokeDasharray="502" strokeDashoffset="380" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <span className="text-4xl md:text-5xl font-black text-white leading-none">24%</span>
                       <span className="text-[10px] font-mono text-slate-600 uppercase mt-2">Amortized</span>
                    </div>
                  </div>

                  <div className="w-full space-y-4 pt-6 border-t border-white/5">
                     <ProgressRow label="Paid Principal" value={`$${financialDetails.paidPrincipal}`} />
                     <ProgressRow label="Remaining" value={`$${financialDetails.remainingPrincipal}`} color="text-slate-500" />
                     <ProgressRow label="Total Interest" value="$1,240" color="text-purple-500" />
                  </div>

                  <button className="w-full py-6 bg-cyan-600 rounded-3xl font-black uppercase tracking-widest text-[10px] text-white hover:bg-cyan-500 transition-all shadow-2xl shadow-cyan-900/30 active:scale-95">
                    Settle Position Now
                  </button>
               </div>
            </div>

          </div>
        )}

        {activeTab === 'LEDGER' && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Panel label="Principal_Vector" accent="cyan">
                   <div className="text-4xl md:text-5xl font-black text-white tracking-tighter">${financialDetails.remainingPrincipal.toLocaleString()}</div>
                   <div className="text-[10px] font-mono text-slate-600 uppercase mt-3 tracking-widest">Next Cut-off: Oct 20</div>
                </Panel>
                <Panel label="Fixed_Cost_Yield" accent="purple">
                   <div className="text-4xl md:text-5xl font-black text-purple-400 tracking-tighter">14.85% <span className="text-sm text-purple-900">EA</span></div>
                   <div className="text-[10px] font-mono text-slate-600 uppercase mt-3 tracking-widest">Protocol: AEGIS_GUARANTEED</div>
                </Panel>
                <Panel label="Node_Status" accent="emerald">
                   <div className="text-4xl md:text-5xl font-black text-emerald-500 tracking-tighter uppercase italic">Active</div>
                   <div className="text-[10px] font-mono text-slate-600 uppercase mt-3 tracking-widest">Health: Excellent</div>
                </Panel>
             </div>

             <div className="glass rounded-[3rem] md:rounded-[4rem] p-6 md:p-14 border-white/5 overflow-hidden shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b border-white/5 pb-8">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Forensic_Financial_Ledger</h3>
                   <span className="px-4 py-2 bg-white/5 rounded-full text-[10px] font-mono text-slate-500 uppercase tracking-widest border border-white/5">Audit_Secure_V6.0</span>
                </div>
                
                <div className="overflow-x-auto no-scrollbar">
                  <div className="min-w-[700px] md:min-w-full space-y-1">
                     <LedgerHeader />
                     <LedgerRow date="12 Oct, 2024" desc="Principal Credit - Nexus Transfer" amount="- $1,250.00" status="SETTLED" type="CREDIT" />
                     <LedgerRow date="01 Oct, 2024" desc="Monthly Ordinary Interest Charge" amount="+ $82.45" status="SETTLED" type="DEBIT" />
                     <LedgerRow date="15 Sep, 2024" desc="Principal Credit - Recurring Payment" amount="- $500.00" status="SETTLED" type="CREDIT" />
                     <LedgerRow date="01 Sep, 2024" desc="Platform Usage Commission" amount="+ $15.00" status="SETTLED" type="DEBIT" />
                     <LedgerRow date="28 Aug, 2024" desc="Principal Credit - Extraordinary Payment" amount="- $1,500.00" status="SETTLED" type="CREDIT" />
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'APPLICATION' && (
          <div className="h-full min-h-[600px] bg-slate-950/50 rounded-[3rem] md:rounded-[4rem] border border-white/5 overflow-hidden shadow-inner">
            <ApplicantFlow onStepChange={onStepChange} riskData={data} />
          </div>
        )}

        {activeTab === 'NEGOTIATION' && (
          <div className="h-full min-h-[600px] animate-in zoom-in-95 duration-700">
             <NeuralNegotiator activeCase={myCase} />
          </div>
        )}

      </div>
    </div>
  );
};

// UI COMPONENTES AUXILIARES - Responsive Optimized

const TabBtn = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 md:px-10 py-4 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all ${active ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-slate-300'}`}
  >
    {label}
  </button>
);

const BigMetric = ({ label, value, subValue }: any) => (
  <div className="grid gap-1">
    <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest truncate">{label}</span>
    <span className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter">{value}</span>
    <span className="text-[8px] font-black text-slate-700 uppercase">{subValue}</span>
  </div>
);

const ProgressRow = ({ label, value, color = "text-white" }: any) => (
  <div className="flex justify-between items-center py-2">
     <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{label}</span>
     <span className={`text-sm md:text-base font-black ${color}`}>{value}</span>
  </div>
);

const Panel = ({ children, label, accent }: any) => (
  <div className="glass rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 border-white/5 shadow-xl bg-slate-900/10">
    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
      <span className={`w-2 h-2 rounded-full ${accent === 'cyan' ? 'bg-cyan-500' : accent === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'} shadow-lg`}></span>
      {label}
    </h3>
    {children}
  </div>
);

const LedgerHeader = () => (
  <div className="grid grid-cols-4 px-8 py-5 text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] bg-white/[0.02] rounded-t-3xl">
     <span>Date / Ref</span>
     <span>Audit_Vector</span>
     <span className="text-right">Amount</span>
     <span className="text-right">Status</span>
  </div>
);

const LedgerRow = ({ date, desc, amount, status, type }: any) => (
  <div className="grid grid-cols-4 px-8 py-7 border-b border-white/5 hover:bg-white/5 transition-all group last:border-0 rounded-2xl">
     <div className="grid gap-1">
        <span className="text-xs font-black text-white">{date}</span>
        <span className="text-[8px] font-mono text-slate-700 uppercase">Hash_Verified</span>
     </div>
     <div className="text-xs font-mono text-slate-500 group-hover:text-white transition-colors flex items-center">
        {desc}
     </div>
     <div className={`text-right font-black text-sm md:text-base font-mono flex items-center justify-end ${type === 'CREDIT' ? 'text-emerald-500' : 'text-slate-300'}`}>
        {amount}
     </div>
     <div className="text-right flex items-center justify-end">
        <span className="px-4 py-1.5 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500 border border-white/5 group-hover:border-cyan-500/30 group-hover:text-cyan-500 transition-all">
           {status}
        </span>
     </div>
  </div>
);

export default ClientDashboard;
