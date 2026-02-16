
import React, { useState, useRef, useEffect } from 'react';
import { APPLICANT_FLOW_STEP, RiskProfile, RiskLevel } from '../types';
import LegalVault from './LegalVault';

interface ApplicantFlowProps {
  onStepChange: (step: APPLICANT_FLOW_STEP) => void;
  riskData: RiskProfile;
}

const ApplicantFlow: React.FC<ApplicantFlowProps> = ({ onStepChange, riskData }) => {
  const [currentStep, setCurrentStep] = useState<APPLICANT_FLOW_STEP>(APPLICANT_FLOW_STEP.IDENTITY_SCAN);
  const [loanAmount, setLoanAmount] = useState(1200);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [auditEvidence, setAuditEvidence] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const steps = Object.values(APPLICANT_FLOW_STEP);
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    onStepChange(currentStep);
  }, [currentStep, onStepChange]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };

    if (currentStep === APPLICANT_FLOW_STEP.LIVENESS_CHECK) {
      startCamera();
    } else {
      if (stream) stream.getTracks().forEach(track => track.stop());
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === APPLICANT_FLOW_STEP.VAULT_PROCESSING) {
      const timer = setTimeout(() => setCurrentStep(APPLICANT_FLOW_STEP.SUCCESS), 4500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleOcrScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
    }, 2500);
  };

  const next = () => {
    const nextIdx = steps.indexOf(currentStep) + 1;
    if (nextIdx < steps.length) setCurrentStep(steps[nextIdx]);
  };

  const handleSignatureComplete = (evidence: any) => {
    setAuditEvidence(evidence);
    next();
  };

  const maxAvailable = riskData.riskLevel === RiskLevel.CRITICAL ? 50 : 3000 - (riskData.siprScore * 2500);

  return (
    <div className="w-full h-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 bg-slate-950 md:rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700">
      
      {/* Sidebar: Progress & Context */}
      <div className="hidden md:flex md:col-span-3 bg-slate-900/50 p-8 border-r border-white/5 flex-col justify-between">
        <div>
          <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl shadow-cyan-900/40 mb-10 transition-transform hover:scale-110">A</div>
          <h2 className="text-xl font-black text-white tracking-tighter leading-tight mb-4 uppercase">Portal_Ingress</h2>
          <div className="space-y-4">
             {steps.map((step, idx) => (
                <div key={step} className={`flex items-center gap-3 transition-all duration-500 ${idx > currentStepIndex ? 'opacity-20' : 'opacity-100'}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold border ${idx === currentStepIndex ? 'bg-cyan-600 border-cyan-500 text-white scale-125' : idx < currentStepIndex ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 text-slate-500'}`}>
                    {idx < currentStepIndex ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[9px] uppercase font-black tracking-widest ${idx === currentStepIndex ? 'text-white' : 'text-slate-600'}`}>
                    {step.split('_').slice(0, 1)}
                  </span>
                </div>
             ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="text-[10px] font-mono text-slate-700 uppercase mb-2">Node_Region</div>
          <div className="text-cyan-500 font-bold text-[10px] tracking-widest uppercase">AMER-01-SECURE</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="col-span-1 md:col-span-9 flex flex-col h-full overflow-y-auto relative">
        
        {/* Progress HUD */}
        <div className="sticky top-0 p-4 md:p-8 z-30 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
           <div className="flex flex-col">
             <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.2em]">{currentStep}</span>
             <span className="text-sm font-black text-white uppercase tracking-widest">Protocol_Step: {currentStepIndex + 1}/{steps.length}</span>
           </div>
           <div className="w-32 h-1.5 bg-slate-900 rounded-full overflow-hidden">
             <div className="h-full bg-cyan-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
           </div>
        </div>

        <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col justify-center">
          
          {currentStep === APPLICANT_FLOW_STEP.IDENTITY_SCAN && (
            <div className="animate-in slide-in-from-bottom-8 duration-500 max-w-2xl">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 uppercase italic">ID_Core_Extract</h1>
              <p className="text-slate-400 mb-10 text-lg">Visión artificial de alto rendimiento para extracción de datos soberanos.</p>
              
              <div className="grid grid-cols-1 gap-6">
                <div className={`relative aspect-[1.6/1] bg-slate-900 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center overflow-hidden group ${isScanning ? 'border-cyan-500 shadow-[0_0_50px_rgba(34,211,238,0.2)]' : isVerified ? 'border-emerald-500' : 'border-slate-800 hover:border-slate-600'}`}>
                  {isScanning && <div className="absolute inset-x-0 h-1 bg-cyan-500/80 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan_2s_infinite] z-20"></div>}
                  
                  {isVerified ? (
                    <div className="text-center animate-in zoom-in duration-300">
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs">Extraction_Complete</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                      </div>
                      <span className="text-slate-600 font-mono text-[10px] uppercase tracking-[0.4em]">Ready_For_Ingress</span>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={isVerified ? next : handleOcrScan}
                disabled={isScanning}
                className={`mt-10 w-full py-6 rounded-3xl font-black uppercase tracking-[0.4em] transition-all transform active:scale-95 shadow-2xl ${isVerified ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40' : 'bg-white text-black hover:bg-slate-200'}`}
              >
                {isScanning ? 'PROCESSING_BLOBS...' : isVerified ? 'PROCEED_PROTO' : 'START_SCAN'}
              </button>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.LIVENESS_CHECK && (
            <div className="animate-in fade-in slide-in-from-right-12 duration-500">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 uppercase italic">Neural_Liveness</h1>
               <p className="text-slate-400 mb-10 text-lg">Prueba de vida pasiva con análisis espectral en tiempo real.</p>
               
               <div className="relative mx-auto w-full max-w-sm aspect-square">
                 <div className="absolute inset-0 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-950 shadow-[0_0_100px_rgba(34,211,238,0.1)]">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                    <div className="absolute inset-0 border-[20px] border-slate-950 rounded-full"></div>
                 </div>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[90%] h-[90%] border-2 border-cyan-500/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]"></div>
                    <div className="w-6 h-6 bg-cyan-500 rounded-full shadow-[0_0_30px_rgba(34,211,238,1)] animate-pulse"></div>
                 </div>
               </div>

               <button onClick={next} className="mt-12 w-full py-6 bg-cyan-600 text-white font-black uppercase tracking-[0.4em] rounded-3xl hover:bg-cyan-500 transition-all active:scale-95 shadow-2xl shadow-cyan-900/40">Verify_Human_Vector</button>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.BANK_CONNECT && (
            <div className="animate-in fade-in slide-in-from-right-12 duration-500">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 uppercase italic">Financial_Nexus</h1>
               <p className="text-slate-400 mb-12 text-lg">Vinculación segura mediante protocolos Open Banking de baja latencia.</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {[
                   { id: 'bank-1', name: 'J.P. Morgan Chase', color: 'bg-blue-600' },
                   { id: 'bank-2', name: 'Revolut Ultra', color: 'bg-slate-200 text-black' },
                   { id: 'bank-3', name: 'Nubank Premium', color: 'bg-purple-600' },
                   { id: 'bank-4', name: 'HSBC Global', color: 'bg-red-600' }
                 ].map(bank => (
                   <button 
                    key={bank.id} 
                    onClick={() => setSelectedBank(bank.id)}
                    className={`p-6 rounded-3xl border transition-all flex items-center justify-between group ${selectedBank === bank.id ? 'border-cyan-500 bg-cyan-500/10 shadow-lg' : 'border-white/5 bg-slate-900/40 hover:bg-slate-900/80'}`}
                   >
                     <div className="flex items-center gap-4 text-left">
                       <div className={`w-12 h-12 rounded-2xl ${bank.color} flex items-center justify-center font-black text-xs shadow-xl`}>
                         {bank.name[0]}
                       </div>
                       <div>
                         <span className="font-black text-sm text-white block">{bank.name}</span>
                         <span className="text-[9px] font-mono text-slate-600 uppercase">TIER_01_CONNECTED</span>
                       </div>
                     </div>
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedBank === bank.id ? 'border-cyan-500 bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-slate-800'}`}>
                        {selectedBank === bank.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                     </div>
                   </button>
                 ))}
               </div>

               <button 
                 disabled={!selectedBank}
                 onClick={next} 
                 className={`mt-14 w-full py-6 font-black uppercase tracking-[0.4em] rounded-[2rem] transition-all shadow-2xl active:scale-95 ${selectedBank ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40' : 'bg-slate-900 text-slate-700 cursor-not-allowed'}`}
               >
                 Authorize_Connection
               </button>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.FUND_SELECTION && (
            <div className="animate-in slide-in-from-right-12 duration-500">
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-4 uppercase italic">Liquidity_Vector</h1>
               <p className="text-slate-400 mb-12 text-lg">Ajuste de capital reactivo. Los límites se recalculan vía ONNX.</p>
               
               <div className="flex flex-col items-center">
                  <div className="text-center mb-16">
                     <span className="text-slate-600 text-[10px] font-mono uppercase tracking-[0.4em] block mb-4">Capital_Head_Pool</span>
                     <div className="flex items-baseline justify-center gap-2">
                        <span className="text-8xl sm:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                           ${loanAmount}
                        </span>
                        <span className="text-2xl text-cyan-500 font-bold uppercase font-mono">USD</span>
                     </div>
                  </div>

                  <div className="w-full relative px-2 mb-12">
                     <input 
                        type="range" 
                        min="100" 
                        max={maxAvailable > 100 ? Math.floor(maxAvailable/100)*100 : 100} 
                        step="100" 
                        value={loanAmount} 
                        onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                        className="w-full h-3 bg-slate-900 rounded-full appearance-none cursor-pointer accent-cyan-500 mb-8"
                     />
                     <div className="flex justify-between text-[10px] font-mono text-slate-600 font-black uppercase tracking-widest">
                        <span>Min_Threshold: $100</span>
                        <span>Max_Ingress: ${Math.floor(maxAvailable)}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full">
                     <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center text-center">
                        <span className="text-[10px] font-mono text-slate-600 uppercase mb-2 tracking-[0.3em]">Monthly_Debit</span>
                        <span className="text-3xl font-black text-white tracking-tighter">${(loanAmount / 3 * 1.05).toFixed(0)}</span>
                     </div>
                     <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center text-center">
                        <span className="text-[10px] font-mono text-slate-600 uppercase mb-2 tracking-[0.3em]">Neural_Yield</span>
                        <span className="text-3xl font-black text-emerald-500 tracking-tighter">1.42%</span>
                     </div>
                  </div>
               </div>

               <button onClick={next} className="mt-14 w-full py-6 bg-emerald-600 text-white font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-900/40 active:scale-95">Lock_Parameters</button>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.CONTRACT_SIGNING && (
            <LegalVault 
               loanAmount={loanAmount} 
               applicantName={riskData.applicantName} 
               onSignComplete={handleSignatureComplete} 
            />
          )}

          {currentStep === APPLICANT_FLOW_STEP.VAULT_PROCESSING && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-pulse">
               <div className="relative mb-12 group">
                  <div className="w-48 h-48 border-[12px] border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-black text-white text-3xl uppercase tracking-[0.4em] italic drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">AEGIS</div>
               </div>
               <h1 className="text-4xl font-black text-white uppercase tracking-[0.5em] mb-4">Orchestrating_Vault</h1>
               <p className="text-slate-600 font-mono text-xs uppercase">Commiting digital evidence to blockchain ledger...</p>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.SUCCESS && (
            <div className="animate-in zoom-in-95 duration-1000 text-center max-w-3xl mx-auto">
               <div className="w-40 h-40 bg-emerald-500 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-[0_40px_80px_rgba(16,185,129,0.4)] transition-all hover:rotate-6 hover:scale-105">
                  <svg className="w-20 h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
               </div>
               <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4 leading-none uppercase italic">Liquidity_Settled</h1>
               <p className="text-slate-500 text-xl mb-12 leading-relaxed">Su capital ha sido inyectado. La transacción está certificada por el <span className="text-white font-black underline decoration-emerald-500 decoration-4">Núcleo Aegis V3</span>.</p>
               
               <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-white/10 text-left mb-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div className="grid grid-cols-2 gap-8 relative z-10">
                     <div>
                        <span className="text-[10px] font-mono text-slate-600 uppercase block mb-2 tracking-widest">Signed_Signer</span>
                        <span className="text-xl font-black text-white tracking-tight uppercase">{riskData.applicantName}</span>
                     </div>
                     <div>
                        <span className="text-[10px] font-mono text-slate-600 uppercase block mb-2 tracking-widest">Legal_Protocol</span>
                        <span className="text-xl font-black text-emerald-500 tracking-tight">PAdES_ADVANCED</span>
                     </div>
                     <div className="col-span-2">
                        <span className="text-[10px] font-mono text-slate-600 uppercase block mb-2 tracking-widest">Transaction_Hash</span>
                        <span className="text-xs font-mono text-slate-400 break-all">{auditEvidence?.hash_sha256}</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => setCurrentStep(APPLICANT_FLOW_STEP.IDENTITY_SCAN)} className="flex-1 py-6 bg-white text-black font-black uppercase tracking-[0.4em] rounded-[2rem] hover:bg-slate-200 transition-all shadow-2xl active:scale-95">Download_Audit_Ledger</button>
                  <button className="flex-1 py-6 bg-slate-900 text-white font-black uppercase tracking-[0.4em] rounded-[2rem] border border-white/5 hover:bg-slate-800 transition-all active:scale-95">Open_Wallet</button>
               </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(2800%); }
          100% { transform: translateY(-100%); }
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 36px;
          width: 36px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 40px rgba(34,211,238,0.8);
          border: 8px solid #0891b2;
          transition: transform 0.2s;
        }
        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default ApplicantFlow;
