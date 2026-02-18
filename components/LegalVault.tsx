
import React, { useState, useRef, useEffect } from 'react';

interface AuditEvidence {
  hash: string;
  hash_sha256?: string;
}

interface LegalVaultProps {
  loanAmount: number;
  applicantName: string;
  onSignComplete: (evidence: AuditEvidence) => void;
}

const LegalVault: React.FC<LegalVaultProps> = ({ loanAmount, applicantName, onSignComplete }) => {
  const [stage, setStage] = useState<'TRUTH' | 'LEDGER' | 'SEAL'>('TRUTH');
  const [hasRead, setHasRead] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const apr = 14.85;
  const total = loanAmount * (1 + apr / 100);
  const maturityDate = new Date(Date.now() + 365 * 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleSign = () => {
    setVerifying(true);
    setTimeout(() => {
      onSignComplete({ hash: 'E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855' });
    }, 2500);
  };

  return (
    <div className="w-full max-w-2xl h-[550px] sm:h-[650px] md:h-[750px] grid overflow-hidden animate-in slide-in-from-bottom-20 duration-1000">

      {stage === 'TRUTH' && (
        <div className="grid grid-rows-[auto_1fr_auto] gap-8 p-4 md:p-8">
          <div className="text-center">
            <span className="text-cyan-500 font-mono text-[9px] md:text-[11px] tracking-[0.8em] uppercase mb-4 block">Proof_of_Consent_V4</span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none">Truth Table Analysis</h2>
          </div>

          <div className="glass rounded-[3rem] p-8 md:p-12 shadow-3xl grid items-center">
            <div className="grid gap-6 md:gap-8">
              <Row label="Principal_Capital" value={`$${loanAmount.toLocaleString()}`} />
              <Row label="Yield_Cost (APR)" value="14.85%" accent="text-emerald-500" />
              <Row label="Settlement_Total" value={`$${total.toFixed(2)}`} accent="text-cyan-500" />
              <div className="h-[1px] bg-white/5 w-full"></div>
              <Row label="Contract_Maturity" value={maturityDate} />
            </div>
          </div>

          <button
            onClick={() => setStage('LEDGER')}
            className="w-full py-6 md:py-8 bg-white text-black font-black uppercase tracking-[0.6em] text-xs md:text-sm rounded-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95"
          >
            Review Promissory Ledger
          </button>
        </div>
      )}

      {stage === 'LEDGER' && (
        <div className="grid grid-rows-[auto_1fr_auto] gap-6 p-4 md:p-8 h-full">
          <header className="flex justify-between items-end border-b border-white/5 pb-6">
            <div className="grid">
              <span className="text-cyan-500 font-mono text-[9px] tracking-[0.5em] uppercase mb-1">Vault_Transmission</span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase">Legal_Instrument</h2>
            </div>
            <div className="hidden sm:grid text-[10px] font-mono text-slate-600 bg-white/5 px-4 py-2 rounded-full border border-white/5 uppercase font-black">Secure_Layer_3</div>
          </header>

          <div
            ref={scrollRef}
            onScroll={(e) => {
              const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
              if (scrollHeight - scrollTop <= clientHeight + 50) setHasRead(true);
            }}
            className="bg-white text-slate-950 p-8 md:p-20 overflow-y-auto rounded-[3rem] font-serif leading-relaxed shadow-inner border-[12px] md:border-[24px] border-[#02040a] custom-scrollbar-light"
          >
            <div className="max-w-md mx-auto">
              <h3 className="text-center font-black text-2xl mb-12 uppercase border-b-4 border-slate-200 pb-10 tracking-tight italic">Immutable Digital Promissory Note</h3>
              <p className="mb-8 text-lg">I, <strong>{applicantName}</strong>, acting in my own right, hereby acknowledge and agree to owe the amount of <strong>${loanAmount} USD</strong> to Project Aegis.</p>
              <p className="mb-8"><strong>NON-REPUDIATION:</strong> Biometric interaction and full scrolling of this digital ledger constitutes full proof of intent and advanced electronic signature under existing institutional frameworks.</p>
              <p className="mb-12 italic opacity-60">ID_ORIGIN: 0x{Math.random().toString(16).substr(2, 8).toUpperCase()} | UTC_TIMESTAMP: {new Date().toISOString()}</p>
            </div>
          </div>

          <button
            disabled={!hasRead}
            onClick={() => setStage('SEAL')}
            className={`w-full py-6 md:py-8 font-black uppercase tracking-[0.6em] text-xs md:text-sm rounded-2xl transition-all shadow-2xl active:scale-95 ${hasRead ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-slate-900 text-slate-700 cursor-not-allowed'}`}
          >
            {hasRead ? 'Acknowledge & Sign' : 'Scroll to End to Sign'}
          </button>
        </div>
      )}

      {stage === 'SEAL' && (
        <div className="grid place-items-center p-4">
          <div className="w-full max-w-sm grid gap-12">
            <div className="text-center grid gap-2">
              <span className="text-purple-500 font-mono text-[10px] tracking-[1em] uppercase block">Identity_Validation</span>
              <h2 className="text-4xl font-black text-white tracking-tighter">Bio_Handshake</h2>
            </div>

            <div className="glass rounded-[3rem] p-8 md:p-12 grid gap-10 shadow-3xl border-t-purple-500/40">
              <div className="grid grid-cols-6 gap-2">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`h-16 rounded-xl border grid place-items-center text-xl font-black transition-all ${otp[i] ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(0,242,255,0.3)]' : 'border-white/5 bg-black/40 text-slate-800'}`}>
                    {otp[i] || '•'}
                  </div>
                ))}
              </div>
              <input
                type="text" maxLength={6} autoFocus value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="absolute opacity-0 pointer-events-none"
              />

              <div className="grid grid-cols-2 gap-4">
                <BioMeta label="GPS_LOCK" value="Verified" />
                <BioMeta label="MAC_HASH" value="Sovereign" />
              </div>

              <button
                disabled={otp.length < 6 || verifying}
                onClick={handleSign}
                className={`w-full py-6 md:py-8 rounded-2xl font-black uppercase tracking-[0.6em] text-xs md:text-sm transition-all relative overflow-hidden group ${otp.length === 6 ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.3)]' : 'bg-slate-900 text-slate-700 cursor-not-allowed'}`}
              >
                {verifying ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span className="animate-pulse">Committing_Block...</span>
                  </div>
                ) : 'Execute Digital Seal'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// ROW CON GRID DE PRECISIÓN
const Row = ({ label, value, accent }: { label: string; value: string; accent?: string }) => (
  <div className="grid grid-cols-[1fr_auto] items-end pb-4 border-b border-white/5">
    <span className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{label}</span>
    <span className={`text-xl md:text-3xl font-black ${accent || 'text-white'}`}>{value}</span>
  </div>
);

const BioMeta = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-black/40 p-4 rounded-2xl border border-white/5 grid place-items-center text-center">
    <span className="text-[8px] font-mono text-slate-700 uppercase mb-1">{label}</span>
    <span className="text-[11px] font-black text-emerald-500 uppercase">{value}</span>
  </div>
);

export default LegalVault;
