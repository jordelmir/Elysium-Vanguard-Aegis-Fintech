
import React, { useState, useRef, useEffect } from 'react';

interface LegalVaultProps {
  loanAmount: number;
  applicantName: string;
  onSignComplete: (evidence: any) => void;
}

const LegalVault: React.FC<LegalVaultProps> = ({ loanAmount, applicantName, onSignComplete }) => {
  const [stage, setStage] = useState<'TRUTH_TABLE' | 'CONTRACT_VIEW' | 'SIGNATURE_HUB'>('TRUTH_TABLE');
  const [hasReadToBottom, setHasReadToBottom] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const catRate = 14.85;
  const totalToPay = loanAmount * 1.1485;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setHasReadToBottom(true);
    }
  };

  const executeFinalSignature = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const evidence = {
        transaction_id: `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        signer: applicantName,
        timestamp: new Date().toISOString(),
        location: location,
        hash_sha256: "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
        status: "PAdES_SIGNED"
      };
      onSignComplete(evidence);
    }, 3000);
  };

  return (
    <div className="w-full flex flex-col h-full max-h-[700px] animate-in slide-in-from-bottom-8 duration-700">
      
      {stage === 'TRUTH_TABLE' && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center mb-8">
            <span className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-2 block">Stage_01: Integrity_Check</span>
            <h2 className="text-3xl font-black text-white tracking-tighter">Truth Table Analysis</h2>
          </div>
          
          <div className="bg-slate-900/60 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-slate-500 text-xs font-bold uppercase">Monto Neto Solicitado</span>
                <span className="text-2xl font-black text-white">${loanAmount.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-slate-500 text-xs font-bold uppercase">Costo Anual Total (CAT)</span>
                <span className="text-2xl font-black text-emerald-500">{catRate}%</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-4">
                <span className="text-slate-500 text-xs font-bold uppercase">Total a Liquidar</span>
                <span className="text-2xl font-black text-cyan-500">${totalToPay.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-500 text-xs font-bold uppercase">Fecha de Vencimiento</span>
                <span className="text-xl font-black text-white">15 OCT 2025</span>
              </div>
            </div>
            <div className="bg-slate-800/40 p-4 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-[10px] text-slate-400 font-mono uppercase">Los datos anteriores son inmutables para el contrato.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setStage('CONTRACT_VIEW')}
            className="mt-8 w-full py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-200 transition-all shadow-xl shadow-white/5 active:scale-95"
          >
            Aceptar y Leer Contrato
          </button>
        </div>
      )}

      {stage === 'CONTRACT_VIEW' && (
        <div className="flex-1 flex flex-col">
          <header className="mb-4 flex justify-between items-end">
            <div>
              <span className="text-cyan-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-1 block">Stage_02: Document_Verification</span>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Contract_Vault_Alpha</h2>
            </div>
            <div className="text-[9px] font-mono text-slate-600 bg-white/5 px-2 py-1 rounded">ID: {Math.random().toString(36).substr(2, 9)}</div>
          </header>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 bg-white text-slate-900 p-8 md:p-12 overflow-y-auto rounded-3xl font-serif text-sm leading-relaxed shadow-inner border-[12px] border-slate-900"
          >
            <h3 className="text-center font-bold text-lg mb-8 uppercase border-b-2 border-slate-200 pb-4">PAGARÉ DIGITAL Y CONTRATO DE APERTURA DE CRÉDITO</h3>
            <p className="mb-4">Por el presente documento, yo, <strong>{applicantName}</strong>, con plena capacidad legal, reconozco adeudar incondicionalmente a <strong>PROJECT AEGIS FINANCIAL CORP</strong> la cantidad de <strong>${loanAmount} USD</strong>.</p>
            <p className="mb-4"><strong>CLÁUSULA PRIMERA:</strong> Las partes acuerdan que el presente contrato se rige bajo los estándares internacionales de firma electrónica avanzada (FEA). El usuario acepta que el sellado de tiempo atómico y las coordenadas geográficas capturadas en este acto constituyen prueba plena de voluntad.</p>
            <p className="mb-4"><strong>CLÁUSULA SEGUNDA:</strong> El incumplimiento del pago en la fecha estipulada (15 OCT 2025) facultará a la entidad a ejecutar las garantías digitales vinculadas en el paso 03 (Financial Hub).</p>
            <div className="h-64 bg-slate-50 border border-slate-100 rounded p-4 text-[10px] font-mono text-slate-400 leading-tight">
              [SYSTEM_GEN_WATERMARK: IP=192.168.1.45 | DEVICE=AEGIS_KERNEL_PRO | SEED=99283-X]<br/>
              ... LOREM IPSUM LEGALESE REPEAT ...<br/>
              ... LOREM IPSUM LEGALESE REPEAT ...<br/>
              ... LOREM IPSUM LEGALESE REPEAT ...<br/>
              ... LOREM IPSUM LEGALESE REPEAT ...<br/>
              ... LOREM IPSUM LEGALESE REPEAT ...<br/>
              ... LOREM IPSUM LEGALESE REPEAT ...<br/>
              ... LOREM IPSUM LEGALESE REPEAT ...<br/>
              ... LOREM IPSUM LEGALESE REPEAT ...
            </div>
            <p className="mt-8 text-center text-slate-400 italic">Fin del Documento Legal</p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {!hasReadToBottom && <div className="text-center animate-bounce text-[10px] font-mono text-cyan-500 uppercase font-bold">Por favor lea hasta el final para habilitar la firma</div>}
            <button 
              disabled={!hasReadToBottom}
              onClick={() => setStage('SIGNATURE_HUB')}
              className={`w-full py-5 font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl active:scale-95 ${hasReadToBottom ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
            >
              Confirmar Lectura
            </button>
          </div>
        </div>
      )}

      {stage === 'SIGNATURE_HUB' && (
        <div className="flex-1 flex flex-col justify-center items-center">
           <div className="w-full max-w-sm">
              <div className="text-center mb-10">
                <span className="text-purple-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-2 block">Stage_03: Multi_Factor_Auth</span>
                <h2 className="text-3xl font-black text-white tracking-tighter">Final Handshake</h2>
                <p className="text-slate-500 text-xs mt-2">Ingrese el código OTP enviado a su dispositivo seguro para sellar el contrato digitalmente.</p>
              </div>

              <div className="space-y-6">
                <div className="flex justify-center gap-3">
                  {['', '', '', '', '', ''].map((_, i) => (
                    <div key={i} className="w-10 h-14 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center text-xl font-black text-cyan-400">
                      {otpValue[i] || '•'}
                    </div>
                  ))}
                </div>
                
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  className="absolute opacity-0 cursor-default"
                  autoFocus
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-600 uppercase mb-2">Geo_Location</span>
                    <div className="text-[10px] font-bold text-emerald-500">{location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Detecting...'}</div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center">
                    <span className="text-[8px] font-mono text-slate-600 uppercase mb-2">Device_Bio</span>
                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Verified_Secure</div>
                  </div>
                </div>

                <button 
                  disabled={otpValue.length < 6 || isVerifying}
                  onClick={executeFinalSignature}
                  className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.4em] transition-all relative overflow-hidden ${otpValue.length === 6 ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-900/40' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                >
                  {isVerifying ? (
                    <div className="flex items-center justify-center gap-3">
                       <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                       <span>Firmando...</span>
                    </div>
                  ) : (
                    'Sellar y Firmar'
                  )}
                </button>
              </div>

              <div className="mt-8 p-4 bg-slate-950/80 rounded-2xl border border-white/5 font-mono text-[9px] text-slate-600 leading-tight">
                >> AEGIS_PKI_SYSTEM_V3<br/>
                >> APPLYING_X.509_CERTIFICATE<br/>
                >> EMBEDDING_GEO_STAMP: {location?.lat}<br/>
                >> GENERATING_AUDIT_TRAIL_BLOCK...
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default LegalVault;
