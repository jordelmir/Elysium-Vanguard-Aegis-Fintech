
import React, { useState, useEffect, useCallback } from 'react';
import { bioSocket } from './services/mockSocketService';
import { RiskProfile, RiskLevel, APPLICANT_FLOW_STEP, USER_ROLE } from './types';
import SystemMonitor from './components/SystemMonitor';
import ClientDashboard from './components/ClientDashboard';
import AuthScreen from './components/AuthScreen';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [data, setData] = useState<RiskProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<USER_ROLE | null>(null);
  const [activeUserStep, setActiveUserStep] = useState<APPLICANT_FLOW_STEP>(APPLICANT_FLOW_STEP.IDENTITY_SCAN);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    return bioSocket.subscribe(setData);
  }, []);

  const runAiAudit = useCallback(async () => {
    if (!data || isAuditing) return;
    setIsAuditing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as a senior risk auditor. Analyze this data packet: ${JSON.stringify(data)}. 
      Return a JSON object with: verdict, reasoning (3 technical points), and confidence (0-1).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const auditResult = JSON.parse(response.text || "{}");
      setData(prev => prev ? { ...prev, aiAudit: auditResult } : null);
    } catch (e) { console.error(e); } finally { setIsAuditing(false); }
  }, [data, isAuditing]);

  const handleLogin = (role: USER_ROLE) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  if (!data) return (
    <div className="min-h-screen w-full bg-[#02040a] grid place-items-center font-mono overflow-hidden">
      <div className="flex flex-col items-center p-8 text-center max-w-full">
        {/* Animated Scanning Line */}
        <div className="relative w-48 h-[2px] bg-slate-900 overflow-hidden rounded-full mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-[scan_2s_infinite]"></div>
        </div>

        <div className="space-y-6">
          <h2 className="text-[10px] md:text-[12px] tracking-[0.5em] md:tracking-[0.8em] text-cyan-500 font-black uppercase leading-none break-all sm:break-normal">
            AEGIS_COGNITIVE_BOOT
          </h2>
          <div className="flex flex-col items-center gap-3">
            <p className="text-[9px] text-slate-700 uppercase tracking-widest font-bold">
              Awaiting Uplink Synchronization...
            </p>
            <div className="flex gap-1.5">
              <div className="w-1 h-1 bg-cyan-500/40 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-cyan-500/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-cyan-500/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        </div>

        {/* Technical Metadata Footer */}
        <div className="mt-20 opacity-20 text-[7px] text-slate-500 font-mono space-y-1">
          <p>KERNEL_REVISION: 6.4.2-GOLD</p>
          <p>BIO_METRIC_BUFFER: 0x82A10F</p>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const isCritical = data?.riskLevel === RiskLevel.CRITICAL;

  return (
    <div className={`h-[100dvh] w-full bg-[#000] flex flex-col transition-all duration-1000 overflow-hidden ${isCritical ? 'risk-critical' : ''}`}>
      {/* Shell Container */}
      <div className="flex-1 w-full 2xl:max-w-[1920px] 2xl:mx-auto 2xl:border-x 2xl:border-white/5 flex flex-col bg-[#02040a] relative overflow-hidden">

        {/* HEADER HUD */}
        <header className="h-16 md:h-20 border-b border-white/10 glass flex items-center justify-between px-4 md:px-12 z-[100] shrink-0">
          <div className="flex items-center gap-4">
            <div
              onClick={handleLogout}
              className={`w-10 h-10 rounded-xl grid place-items-center font-black text-sm ${isCritical ? 'bg-red-600' : 'bg-cyan-600'} shadow-[0_0_20px_rgba(0,242,255,0.4)] cursor-pointer hover:scale-105 active:scale-95 transition-transform`}
            >Æ</div>
            <div className="hidden sm:grid">
              <span className="text-[11px] font-black tracking-[0.2em] text-white uppercase leading-none">{userRole}_ENCLAVE</span>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mt-1">v6.4.2_STABLE</span>
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-10">
            {userRole === USER_ROLE.ADMIN && (
              <button
                onClick={runAiAudit}
                disabled={isAuditing}
                className="hidden lg:flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
              >
                {isAuditing ? <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div> : <div className="w-2 h-2 bg-cyan-500 rounded-full group-hover:scale-125"></div>}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Cognitive_Audit</span>
              </button>
            )}
            <div className="grid text-right">
              <span className="text-[9px] font-mono text-slate-700 uppercase font-black">Sync_Uplink</span>
              <span className="text-xs md:text-sm font-black text-white/80 font-mono tracking-tighter">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all ml-4"
            >
              <span>EXIT_ENCLAVE</span>
            </button>
          </div>
        </header>

        {/* VIEWPORT */}
        <main className="flex-1 relative flex flex-col min-h-0">
          {userRole === USER_ROLE.ADMIN ? (
            <SystemMonitor data={data} activeUserStep={activeUserStep} />
          ) : userRole === USER_ROLE.OFFICER ? (
            <SystemMonitor data={data} activeUserStep={activeUserStep} forcedTab="COLLECTIONS" />
          ) : (
            <ClientDashboard data={data} onStepChange={setActiveUserStep} />
          )}
        </main>

        {/* FOOTER HUD */}
        <footer className="h-10 border-t border-white/5 bg-black/80 backdrop-blur-3xl flex items-center justify-between px-6 z-50 shrink-0">
          <div className="flex items-center gap-4">
            <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Auth: {userRole} // Net: P2P_ENCRYPTED</span>
          </div>
          <div className="hidden md:block text-[9px] font-mono text-slate-800 uppercase font-black italic tracking-[0.5em]">
            Sovereign_Liquidity_Cortex
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
