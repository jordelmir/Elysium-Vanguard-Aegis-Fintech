
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
  const [auditEvidence, setAuditEvidence] = useState<{ hash: string; hash_sha256?: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Added type assertion to ensure step in map is treated as string
  const steps = Object.values(APPLICANT_FLOW_STEP) as string[];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    onStepChange(currentStep as APPLICANT_FLOW_STEP);
  }, [currentStep, onStepChange]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) { console.error("Camera access denied", err); }
    };

    if (currentStep === APPLICANT_FLOW_STEP.LIVENESS_CHECK || currentStep === APPLICANT_FLOW_STEP.IDENTITY_SCAN) startCamera();
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === APPLICANT_FLOW_STEP.VAULT_PROCESSING) {
      const timer = setTimeout(() => setCurrentStep(APPLICANT_FLOW_STEP.SUCCESS), 4500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleOcrScan = () => {
    setIsScanning(true);
    setTimeout(() => { setIsScanning(false); setIsVerified(true); }, 2500);
  };

  const next = () => {
    const nextIdx = steps.indexOf(currentStep) + 1;
    if (nextIdx < steps.length) setCurrentStep(steps[nextIdx] as APPLICANT_FLOW_STEP);
  };

  const handleSignatureComplete = (evidence: any) => {
    setAuditEvidence(evidence);
    next();
  };

  const maxAvailable = riskData.riskLevel === RiskLevel.CRITICAL ? 50 : 3000 - (riskData.siprScore * 2500);

  return (
    <div className="w-full h-full max-w-[1800px] mx-auto flex flex-col md:flex-row glass-vanguard bg-black/40 md:rounded-[3rem] border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-700 entrance-bloom">
      {/* Sidebar: Progress & Context - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-80 glass-vanguard bg-black/20 p-10 border-r border-white/5 flex-col justify-between shrink-0">
        <div>
          <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-xl shadow-cyan-900/40 mb-10 transition-transform hover-glitch hover:scale-110">A</div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase mb-6">Portal_Ingress</h2>
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={step} className={`flex items-center gap-3 transition-all duration-500 ${idx > currentStepIndex ? 'opacity-20' : 'opacity-100'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${idx === currentStepIndex ? 'bg-cyan-600 border-cyan-500 text-white scale-125 shadow-[0_0_15px_rgba(8,145,178,0.5)]' : idx < currentStepIndex ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 text-slate-500'}`}>
                  {idx < currentStepIndex ? '✓' : idx + 1}
                </div>
                <span className={`text-[9px] uppercase font-black tracking-widest ${idx === currentStepIndex ? 'text-white' : 'text-slate-600'}`}>
                  {step.split('_')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col gap-1">
          <span className="text-[10px] font-mono text-slate-700 uppercase tracking-widest">Node_Region</span>
          <span className="text-cyan-500 font-bold text-[10px] tracking-widest uppercase">AMER_SECURE_VAULT</span>
        </div>
      </div>

      {/* Main Content Area - Responsive Flex */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative">

        {/* Mobile Progress Bar */}
        <div className="sticky top-0 p-4 md:p-8 z-40 flex flex-col gap-2 glass-vanguard bg-black/60 backdrop-blur-xl border-b border-white/5">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[9px] font-mono text-slate-500 uppercase tracking-widest">{currentStep}</span>
              <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest">Protocol: {currentStepIndex + 1}/{steps.length}</span>
            </div>
            <div className="w-24 md:w-32 h-1.5 glass-vanguard bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all duration-1000 shadow-[0_0_10px_#06b6d4]" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-8 lg:p-12 flex flex-col justify-center min-h-[500px]">

          {currentStep === APPLICANT_FLOW_STEP.IDENTITY_SCAN && (
            <div className="animate-in slide-in-from-bottom-8 duration-500 max-w-2xl mx-auto w-full text-center md:text-left">
              <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase italic leading-none text-glow-cyan">ID_Core_Extract</h1>
              <p className="text-slate-400 mb-8 md:mb-12 text-base md:text-xl">Sovereign document scanning via computer vision.</p>

              <div className={`relative aspect-[1.6/1] w-full glass-vanguard bg-black/40 rounded-[1.5rem] md:rounded-[3rem] border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center overflow-hidden group ${isScanning ? 'border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : isVerified ? 'border-emerald-500' : 'border-white/5 hover:border-white/20'}`}>
                {isScanning && <div className="absolute inset-x-0 h-1 bg-cyan-500/80 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-[scan_2s_infinite] z-20"></div>}

                {isVerified ? (
                  <div className="text-center animate-in zoom-in duration-500">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                      <svg className="w-8 h-8 md:w-12 md:h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Extraction_Complete</span>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.5] brightness-75 transition-opacity duration-1000" />
                    <div className="relative z-10 text-center p-8">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-white/5 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10">
                        <svg className="w-8 h-8 md:w-12 md:h-12 text-cyan-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                      </div>
                      <span className="text-cyan-500/60 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.4em] drop-shadow-lg">Await_Ingress</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={isVerified ? next : handleOcrScan}
                disabled={isScanning}
                className={`mt-8 md:mt-12 w-full py-5 md:py-7 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.4em] transition-all transform active:scale-95 shadow-2xl hover-glitch ${isVerified ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40' : 'bg-white text-black hover:bg-slate-200'}`}
              >
                {isScanning ? 'Syncing...' : isVerified ? 'Proceed' : 'Capture_ID'}
              </button>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.LIVENESS_CHECK && (
            <div className="animate-in fade-in slide-in-from-right-12 duration-500 text-center max-w-lg mx-auto w-full">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase italic leading-none">Neural_Proof</h1>
              <p className="text-slate-400 mb-8 md:mb-12 text-base">Liveness proof via spectral retinal analysis.</p>

              <div className="relative mx-auto w-48 sm:w-64 md:w-80 aspect-square">
                <div className="absolute inset-0 rounded-full border-2 md:border-4 border-white/5 overflow-hidden glass-vanguard bg-black/60 shadow-2xl">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1] opacity-70" />
                  <div className="absolute inset-0 border-[10px] md:border-[20px] border-black/40 rounded-full"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[90%] h-[90%] border-2 border-cyan-500/20 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                  <div className="w-4 h-4 md:w-6 md:h-6 bg-cyan-500 rounded-full shadow-[0_0_30px_rgba(34,211,238,1)] animate-pulse"></div>
                </div>
              </div>

              <button onClick={next} className="mt-8 md:mt-12 w-full py-5 md:py-7 bg-cyan-600 text-white font-black uppercase tracking-[0.4em] rounded-2xl md:rounded-[2rem] hover:bg-cyan-500 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] neon-breathing hover-glitch">Verify_Biological_Vector</button>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.BANK_CONNECT && (
            <div className="animate-in fade-in slide-in-from-right-12 duration-500 max-w-2xl mx-auto w-full">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase italic leading-none">Financial_Nexus</h1>
              <p className="text-slate-400 mb-8 md:mb-12 text-base">Low-latency Open Banking protocol connection.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {[
                  { id: 'bank-1', name: 'JPM Chase', color: 'bg-blue-600' },
                  { id: 'bank-2', name: 'Revolut Ultra', color: 'bg-slate-200 text-black' },
                  { id: 'bank-3', name: 'Nubank Premium', color: 'bg-purple-600' },
                  { id: 'bank-4', name: 'HSBC Global', color: 'bg-red-600' }
                ].map(bank => (
                  <button
                    key={bank.id} onClick={() => setSelectedBank(bank.id)}
                    className={`p-4 md:p-6 rounded-2xl md:rounded-3xl border transition-all flex items-center justify-between group ${selectedBank === bank.id ? 'border-cyan-500 bg-cyan-700/20 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'border-white/5 glass-vanguard bg-black/20'}`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${bank.color} flex items-center justify-center font-black text-xs shadow-xl`}>
                        {bank.name[0]}
                      </div>
                      <div className="text-left">
                        <span className="font-black text-xs md:text-sm text-white block truncate">{bank.name}</span>
                        <span className="text-[7px] md:text-[9px] font-mono text-slate-600 uppercase">TIER_01</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                disabled={!selectedBank} onClick={next}
                className={`mt-10 md:mt-14 w-full py-5 md:py-7 font-black uppercase tracking-[0.4em] rounded-2xl md:rounded-[2rem] transition-all shadow-2xl hover-glitch ${selectedBank ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40' : 'bg-slate-900 text-slate-700 cursor-not-allowed'}`}
              >
                Authorize_Nexus
              </button>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.FUND_SELECTION && (
            <div className="animate-in slide-in-from-right-12 duration-500 max-w-2xl mx-auto w-full text-center">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase italic">Liquidity_Vector</h1>

              <div className="flex flex-col items-center">
                <div className="text-center mb-8 md:mb-16 cosmic-slide-in">
                  <span className="text-slate-600 text-[8px] md:text-[10px] font-mono uppercase tracking-[0.4em] block mb-2 md:mb-4">Capital_Pool</span>
                  <div className="flex items-baseline justify-center gap-1 md:gap-2">
                    <span className="text-6xl sm:text-7xl md:text-9xl font-black text-white tracking-tighter data-stream-flicker">${loanAmount}</span>
                    <span className="text-lg md:text-2xl text-cyan-500 font-bold uppercase font-mono">USD</span>
                  </div>
                </div>

                <div className="w-full relative px-2 mb-8 md:mb-12">
                  <input
                    type="range" min="100" max={maxAvailable > 100 ? Math.floor(maxAvailable / 100) * 100 : 100} step="100"
                    value={loanAmount} onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                    className="w-full h-3 glass-vanguard bg-black/40 rounded-full appearance-none cursor-pointer accent-cyan-500 mb-6 md:mb-8"
                  />
                  <div className="flex justify-between text-[7px] md:text-[9px] font-mono text-slate-600 font-black uppercase tracking-widest">
                    <span>Min: $100</span>
                    <span>Max: ${Math.floor(maxAvailable)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full">
                  <div className="glass-vanguard bg-black/40 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/5 flex flex-col items-center shadow-xl">
                    <span className="text-[8px] md:text-[10px] font-mono text-slate-600 uppercase mb-1 tracking-widest">Debit</span>
                    <span className="text-xl md:text-3xl font-black text-white tracking-tighter">${(loanAmount / 3 * 1.05).toFixed(0)}</span>
                  </div>
                  <div className="glass-vanguard bg-black/40 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/5 flex flex-col items-center shadow-xl">
                    <span className="text-[8px] md:text-[10px] font-mono text-slate-600 uppercase mb-1 tracking-widest">Yield</span>
                    <span className="text-xl md:text-3xl font-black text-emerald-500 tracking-tighter text-glow-emerald">1.42%</span>
                  </div>
                </div>
              </div>

              <button onClick={next} className="mt-10 md:mt-14 w-full py-5 md:py-7 bg-emerald-600 text-white font-black uppercase tracking-[0.4em] rounded-2xl md:rounded-[2rem] hover:bg-emerald-500 transition-all shadow-2xl active:scale-95 hover-glitch">Commit_Capital</button>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.CONTRACT_SIGNING && (
            <div className="flex-1 flex flex-col items-center w-full">
              <LegalVault
                loanAmount={loanAmount}
                applicantName={riskData.applicantName}
                onSignComplete={handleSignatureComplete}
              />
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.VAULT_PROCESSING && (
            <div className="flex-1 flex flex-col items-center justify-center text-center animate-pulse p-4">
              <div className="relative mb-8 md:mb-12 group">
                <div className="w-32 h-32 md:w-48 md:h-48 border-[8px] md:border-[12px] border-cyan-500/10 border-t-cyan-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-black text-white text-xl md:text-3xl uppercase tracking-widest italic drop-shadow-2xl">AEGIS</div>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">Securing_Vault</h1>
              <p className="text-slate-600 font-mono text-[9px] md:text-xs uppercase">Committing evidence to digital ledger...</p>
            </div>
          )}

          {currentStep === APPLICANT_FLOW_STEP.SUCCESS && (
            <div className="animate-in zoom-in-95 duration-1000 text-center max-w-2xl mx-auto w-full p-4 md:p-0">
              <div className="w-24 h-24 md:w-40 md:h-40 bg-emerald-500 rounded-[1.5rem] md:rounded-[3rem] flex items-center justify-center mx-auto mb-8 md:mb-12 shadow-2xl">
                <svg className="w-12 h-12 md:w-20 md:h-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h1 className="text-3xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-none uppercase italic text-glow-emerald">Settled</h1>
              <p className="text-slate-500 text-sm md:text-xl mb-8 md:mb-12 leading-relaxed">Transaction certified by the Aegis Nucleus.</p>

              <div className="glass-vanguard bg-black/40 p-6 md:p-10 rounded-2xl md:rounded-[3rem] border border-white/10 text-left mb-8 md:mb-12 shadow-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
                  <div>
                    <span className="text-[8px] md:text-[10px] font-mono text-slate-600 uppercase block mb-1">Signer</span>
                    <span className="text-sm md:text-xl font-black text-white tracking-tight uppercase truncate block">{riskData.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] md:text-[10px] font-mono text-slate-600 uppercase block mb-1">Protocol</span>
                    <span className="text-sm md:text-xl font-black text-emerald-500 tracking-tight data-stream-flicker">PAdES_V2</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <span className="text-[8px] md:text-[10px] font-mono text-slate-600 uppercase block mb-1">TX_Hash</span>
                    <span className="text-[8px] md:text-[9px] font-mono text-slate-400 break-all">{auditEvidence?.hash_sha256 || 'SHA-256_ACTIVE_LOCK'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button onClick={() => setCurrentStep(APPLICANT_FLOW_STEP.IDENTITY_SCAN)} className="flex-1 py-4 md:py-6 bg-white text-black font-black uppercase tracking-widest text-xs md:text-sm rounded-xl md:rounded-[2rem] hover:bg-slate-200 transition-all">Download_Ledger</button>
                <button className="flex-1 py-4 md:py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-xs md:text-sm rounded-xl md:rounded-[2rem] border border-white/5 hover:bg-slate-800 transition-all">Finish</button>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(1800%); }
          100% { transform: translateY(-100%); }
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(34,211,238,0.8);
          border: 6px solid #0891b2;
        }
        @media (min-width: 768px) {
          input[type=range]::-webkit-slider-thumb {
            height: 36px;
            width: 36px;
            border: 8px solid #0891b2;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplicantFlow;
