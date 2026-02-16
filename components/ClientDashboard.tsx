
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
    // Ensuring safety if collections cases is empty
    const baseCase = data.collections.cases[0] || {
        loanId: 'LN-PENDING',
        amountDue: 0,
        daysPastDue: 0
    };
    return {
      ...baseCase,
      applicantName: data.applicantName,
      loanId: data.applicantId.includes('-') ? `LN-AEGIS-${data.applicantId.split('-')[1]}` : `LN-AEGIS-${data.applicantId}`
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
    <div className="h-full w-full flex flex-col bg-[#02040a] relative overflow-hidden">
      
      {/* HEADER: Dynamic Ingress - Optimized for high and low res */}
      <header className="shrink-0 p-6 md:p-12 lg:p-16 border-b border-white/5 bg-[#02040a]/50 backdrop-blur-3xl z-40">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
          <div className="space-y-6 w-full xl:w-auto">
            <div className="flex flex-wrap items-center gap-4">
              <span className="px-5 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] animate-pulse">
                Node_Session // Primary_Uplink
              </span>
              <span className="text-[11px] font-mono text-slate-700 uppercase tracking-widest font-black">{myCase.loanId}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-white tracking-tighter uppercase italic leading-none truncate max-w-[90vw] select-none">
              {data.applicantName}
            </h1>
          </div>

          <nav className="w-full xl:w-auto overflow-x-auto no-scrollbar py-2">
            <div className="inline-flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-3xl shrink-0 min-w-full sm:min-w-0 shadow-2xl">
              <TabBtn active={activeTab === 'OVERVIEW'} onClick={() => setActiveTab('OVERVIEW')} label="Overview" />
              <TabBtn active={activeTab === 'LEDGER'} onClick={() => setActiveTab('LEDGER')} label="Forensic Ledger" />
              <TabBtn active={activeTab === 'APPLICATION'} onClick={() => setActiveTab('APPLICATION')} label="Liquidity Request" />
              <TabBtn active={activeTab === 'NEGOTIATION'} onClick={() => setActiveTab('NEGOTIATION')} label="Neural Advisor" />
            </div>
          </nav>
        </div>
      </header>

      {/* VIEWPORT - Scrollable workspace with dynamic padding */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-6 md:p-12 lg:p-16 scroll-smooth">
        
        {activeTab === 'OVERVIEW' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-[1800px] mx-auto pb-20">
            
            {/* Main Metrics Card Cluster (Left/Top) */}
            <div className="lg:col-span-8 flex flex-col gap-8 lg:gap-12 order-1">
              <div className="glass rounded-[4rem] md:rounded-[5rem] p-10 md:p-20 border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden bg-gradient-to-br from-slate-900 via-black to-slate-950 group">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-16 hidden lg:block pointer-events-none">
                  <div className="w-32 h-32 bg-cyan-500/5 rounded-[3rem] border border-cyan-500/10 flex items-center justify-center text-cyan-500 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                </div>

                <div className="grid gap-4 mb-14 md:mb-20">
                   <span className="text-[12px] md:text-[14px] font-black text-slate-500 uppercase tracking-[0.5em] font-mono">Sovereign_Credit_Score</span>
                   <div className="flex flex-wrap items-baseline gap-6 md:gap-10">
                     <span className="text-8xl md:text-9xl lg:text-[11rem] font-black text-white tracking-tighter leading-none select-none">842</span>
                     <div className="flex flex-col gap-2">
                        <span className="text-xs md:text-sm font-black text-emerald-500 uppercase tracking-[0.4em] italic">Aegis_Grade: PRIME_NODE</span>
                        <span className="text-[10px] md:text-[11px] text-slate-600 font-mono uppercase tracking-[0.2em] font-black">Global_Ranking: Tier_01</span>
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 border-t border-white/5 pt-14">
                   <BigMetric label="Available_Limit" value="$12,500" subValue="USD_Liquidity" />
                   <BigMetric label="Current_Util" value={`$${myCase.amountDue.toLocaleString()}`} subValue="Active_Vector" />
                   <BigMetric label="Next_Sync" value="Oct 24" subValue="Automated" />
                   <BigMetric label="Yield_APR" value={financialDetails.apr} subValue="Fixed_Protocol" />
                </div>
              </div>

              {/* Action Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
                <div className="glass rounded-[3rem] md:rounded-[4.5rem] p-10 md:p-14 border-white/5 space-y-10 flex flex-col justify-between hover:bg-white/[0.02] transition-colors group">
                   <div className="space-y-6">
                     <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 font-mono">
                       <span className="w-2.5 h-2.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></span>
                       AI_Predictive_Insight
                     </h3>
                     <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                       "Node integrity is exceptional. Protocol recommends a 15% expansion of capital limits to optimize liquidity velocity."
                     </p>
                   </div>
                   <button onClick={() => setActiveTab('NEGOTIATION')} className="w-fit text-[11px] font-black text-cyan-500 uppercase tracking-[0.5em] hover:translate-x-3 transition-transform italic">Consult_Neural_Advisor →</button>
                </div>
                <div className="glass rounded-[3rem] md:rounded-[4.5rem] p-10 md:p-14 border-white/5 flex flex-col justify-center items-center gap-8 text-center group cursor-pointer hover:bg-white/5 transition-all shadow-2xl">
                   <div className="w-20 h-20 rounded-[2rem] bg-white text-black flex items-center justify-center font-black text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-[0_0_50px_rgba(255,255,255,0.2)]">Æ</div>
                   <div className="grid gap-2">
                      <span className="text-sm font-black text-white uppercase tracking-widest">Audit_Ledger_Extract</span>
                      <span className="text-[10px] text-slate-700 font-mono uppercase font-black">Vault_Signed // PAdES v4.2</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Payoff Dynamics (Right/Sidebar) */}
            <div className="lg:col-span-4 space-y-10 order-2">
               <div className="glass rounded-[4rem] p-10 md:p-16 border-white/5 flex flex-col items-center gap-12 relative overflow-hidden bg-slate-900/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] h-full">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.5em] w-full font-mono text-center mb-4">Capital_Recovery_Vector</h3>
                  
                  {/* Circular Visualization */}
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center group">
                    <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                      <circle cx="50%" cy="50%" r="42%" className="stroke-white/[0.03] fill-none" strokeWidth="8%" />
                      <circle cx="50%" cy="50%" r="42%" className="stroke-cyan-500 fill-none transition-all duration-2000" strokeWidth="8%" strokeDasharray="540" strokeDashoffset="410" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                       <span className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter group-hover:scale-110 transition-transform">24%</span>
                       <span className="text-[11px] font-mono text-slate-700 uppercase mt-4 tracking-[0.3em] font-black">Amortized</span>
                    </div>
                  </div>

                  <div className="w-full space-y-6 pt-10 border-t border-white/5">
                     <ProgressRow label="Paid_Principal" value={`$${financialDetails.paidPrincipal.toLocaleString()}`} />
                     <ProgressRow label="Residual_Vector" value={`$${financialDetails.remainingPrincipal.toLocaleString()}`} color="text-slate-500" />
                     <ProgressRow label="Yield_Accrued" value="$1,240.85" color="text-purple-500" />
                  </div>

                  <button className="w-full py-8 md:py-10 bg-cyan-600 rounded-[2.5rem] font-black uppercase tracking-[0.8em] text-[11px] text-white hover:bg-cyan-500 transition-all shadow-[0_30px_60px_rgba(6,182,212,0.3)] active:scale-95 group overflow-hidden relative">
                    <span className="relative z-10">Settle_Position_Now</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
               </div>
            </div>

          </div>
        )}

        {/* Other tabs remain re-designed with similar robust grids */}
        {activeTab === 'LEDGER' && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-12 max-w-[1800px] mx-auto pb-20">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                <Panel label="Principal_Uplink" accent="cyan">
                   <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">${financialDetails.remainingPrincipal.toLocaleString()}</div>
                   <div className="text-[11px] font-mono text-slate-700 uppercase mt-5 tracking-[0.4em] font-black">Cycle_Closing: Oct 20</div>
                </Panel>
                <Panel label="Protocol_Yield" accent="purple">
                   <div className="text-5xl md:text-6xl font-black text-purple-400 tracking-tighter">14.85% <span className="text-sm text-purple-900 ml-2">EA</span></div>
                   <div className="text-[11px] font-mono text-slate-700 uppercase mt-5 tracking-[0.4em] font-black">Algorithm: AEGIS_GUARANTEED</div>
                </Panel>
                <Panel label="Node_Health" accent="emerald">
                   <div className="text-5xl md:text-6xl font-black text-emerald-500 tracking-tighter uppercase italic">Optimal</div>
                   <div className="text-[11px] font-mono text-slate-700 uppercase mt-5 tracking-[0.4em] font-black">Status: Verified_Secure</div>
                </Panel>
             </div>

             <div className="glass rounded-[4rem] p-10 md:p-20 border-white/5 overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-14 border-b border-white/5 pb-10">
                   <div className="space-y-2">
                     <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter italic">Secured_Digital_Ledger</h3>
                     <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest font-black">Transactional_Hash_Audited</p>
                   </div>
                   <span className="px-6 py-3 bg-white/5 rounded-full text-[11px] font-mono text-slate-500 uppercase tracking-[0.4em] border border-white/10 font-black">Audit_Module_v6.4</span>
                </div>
                
                <div className="overflow-x-auto no-scrollbar -mx-10 md:mx-0">
                  <div className="min-w-[800px] px-10 md:px-0">
                     <LedgerHeader />
                     <div className="space-y-1">
                        <LedgerRow date="12 Oct, 2024" desc="Principal Settlement - SWIFT/Nexus" amount="- $1,250.00" status="SETTLED" type="CREDIT" />
                        <LedgerRow date="01 Oct, 2024" desc="Ordinary Interest Protocol Charge" amount="+ $82.45" status="SETTLED" type="DEBIT" />
                        <LedgerRow date="15 Sep, 2024" desc="Capital Ingress - Recurring Batch" amount="- $500.00" status="SETTLED" type="CREDIT" />
                        <LedgerRow date="01 Sep, 2024" desc="Infrastructure Utilization Yield" amount="+ $15.00" status="SETTLED" type="DEBIT" />
                     </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'APPLICATION' && (
          <div className="h-full min-h-[700px] max-w-[1400px] mx-auto animate-in zoom-in-95 duration-1000 pb-20">
            <ApplicantFlow onStepChange={onStepChange} riskData={data} />
          </div>
        )}

        {activeTab === 'NEGOTIATION' && (
          <div className="h-full min-h-[600px] md:min-h-[800px] animate-in slide-in-from-right-12 duration-1000 pb-20">
             <NeuralNegotiator activeCase={myCase} />
          </div>
        )}

      </div>
    </div>
  );
};

// UI COMPONENTES AUXILIARES - Optimized for fluid spacing

const TabBtn = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-8 md:px-12 py-4 rounded-2xl text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${active ? 'bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105' : 'text-slate-600 hover:text-slate-300'}`}
  >
    {label}
  </button>
);

const BigMetric = ({ label, value, subValue }: any) => (
  <div className="grid gap-2 group cursor-default">
    <span className="text-[10px] font-mono text-slate-700 uppercase tracking-[0.4em] font-black group-hover:text-slate-500 transition-colors">{label}</span>
    <span className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter transition-transform group-hover:scale-105 duration-500">{value}</span>
    <span className="text-[9px] font-black text-slate-800 uppercase tracking-widest">{subValue}</span>
  </div>
);

const ProgressRow = ({ label, value, color = "text-white" }: any) => (
  <div className="flex justify-between items-end py-4 border-b border-white/[0.03] group">
     <span className="text-[11px] font-mono text-slate-700 uppercase tracking-[0.4em] font-black group-hover:text-slate-500 transition-colors">{label}</span>
     <span className={`text-xl md:text-2xl font-black tracking-tighter transition-all group-hover:scale-110 ${color}`}>{value}</span>
  </div>
);

const Panel = ({ children, label, accent }: any) => (
  <div className="glass rounded-[3.5rem] md:rounded-[4.5rem] p-10 md:p-14 border-white/5 shadow-2xl bg-slate-900/10 group hover:bg-white/[0.01] transition-colors">
    <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.5em] mb-10 flex items-center gap-4 font-mono group-hover:text-slate-500 transition-colors">
      <span className={`w-2.5 h-2.5 rounded-full ${accent === 'cyan' ? 'bg-cyan-500' : accent === 'purple' ? 'bg-purple-500' : 'bg-emerald-500'} shadow-[0_0_15px_currentColor]`}></span>
      {label}
    </h3>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

const LedgerHeader = () => (
  <div className="grid grid-cols-4 px-12 py-6 text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] bg-white/[0.01] rounded-t-[2.5rem] border-x border-t border-white/5">
     <span>Timestamp / Ref</span>
     <span>Audit_Vector</span>
     <span className="text-right">Transaction_Amount</span>
     <span className="text-right">Validation</span>
  </div>
);

const LedgerRow = ({ date, desc, amount, status, type }: any) => (
  <div className="grid grid-cols-4 px-12 py-10 border border-white/5 hover:bg-white/[0.03] transition-all group last:rounded-b-[2.5rem] relative">
     <div className="grid gap-2">
        <span className="text-sm md:text-base font-black text-white group-hover:text-cyan-400 transition-colors">{date}</span>
        <span className="text-[9px] font-mono text-slate-700 uppercase font-bold tracking-widest">SHA-256_VERIFIED</span>
     </div>
     <div className="text-xs md:text-sm font-mono text-slate-500 group-hover:text-slate-300 transition-colors flex items-center pr-4">
        {desc}
     </div>
     <div className={`text-right font-black text-lg md:text-2xl font-mono flex items-center justify-end tracking-tighter ${type === 'CREDIT' ? 'text-emerald-500' : 'text-slate-400'}`}>
        {amount}
     </div>
     <div className="text-right flex items-center justify-end">
        <span className="px-5 py-2 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 border border-white/10 group-hover:border-cyan-500/30 group-hover:text-cyan-500 transition-all shadow-sm">
           {status}
        </span>
     </div>
     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-cyan-500 group-hover:h-1/2 transition-all duration-500"></div>
  </div>
);

export default ClientDashboard;
