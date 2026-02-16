
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
    <div className="h-screen w-screen bg-[#02040a] grid place-items-center font-mono">
      <div className="flex flex-col items-center">
        <div className="w-24 h-[1px] bg-cyan-500 animate-[width_2s_ease-in-out_infinite]"></div>
        <div className="mt-6 text-[10px] tracking-[1.5em] text-cyan-500/50 uppercase ml-[1.5em]">Initializing_Aegis</div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  const isCritical = data.riskLevel === RiskLevel.CRITICAL;

  return (
    <div className={`h-screen w-screen bg-[#000] overflow-hidden transition-all duration-1000 ${isCritical ? 'risk-critical' : ''}`}>
      {/* Containerized Shell for Ultra-Wide optimization */}
      <div className="h-full w-full 2xl:max-w-[1920px] 2xl:mx-auto 2xl:border-x 2xl:border-white/5 flex flex-col bg-[#02040a] relative shadow-[0_0_100px_rgba(0,0,0,1)]">
        
        {/* HEADER HUD - Optimized height and padding */}
        <header className="h-16 md:h-20 border-b border-white/5 glass grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-12 z-50 shrink-0">
          <div className="flex items-center gap-3 md:gap-5">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl grid place-items-center font-black text-sm ${isCritical ? 'bg-red-600' : 'bg-cyan-600'} shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-transform hover:scale-110 active:scale-90 cursor-pointer`}>Æ</div>
            <div className="hidden sm:grid">
              <span className="text-[10px] md:text-[11px] font-black tracking-[0.3em] uppercase text-white/90">Aegis_{userRole}</span>
              <span className="text-[7px] md:text-[8px] font-mono text-slate-500 uppercase tracking-widest">Sovereign_Cortex_V6.0_STABLE</span>
            </div>
          </div>

          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 items-center backdrop-blur-3xl shadow-2xl">
            <div className="px-4 hidden md:block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-white/10 mr-2">
              {userRole === USER_ROLE.ADMIN ? 'INFRASTRUCTURE' : userRole === USER_ROLE.OFFICER ? 'OPERATIONS' : 'USER_VAULT'}
            </div>
            <button onClick={handleLogout} className="px-5 py-2 text-red-500 hover:bg-red-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
              Disconnect
            </button>
          </div>

          <div className="flex items-center justify-end gap-4 md:gap-10">
            {userRole !== USER_ROLE.CLIENT && (
              <button 
                onClick={runAiAudit}
                disabled={isAuditing}
                className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/60 hover:text-white group"
              >
                {isAuditing ? <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan] group-hover:scale-125 transition-transform"></div>}
                <span className="text-[9px] font-black uppercase tracking-widest">Deep_Audit_Scan</span>
              </button>
            )}
            <div className="grid text-right">
              <span className="text-[8px] font-mono text-slate-700 uppercase font-black tracking-widest">Uplink_Sync</span>
              <span className="text-[10px] md:text-[11px] font-black text-white/80 font-mono tracking-tighter">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</span>
            </div>
          </div>
        </header>

        {/* MAIN VIEWPORT - Dynamic Flex for correct scroll behavior */}
        <main className="flex-1 overflow-hidden relative">
          {userRole === USER_ROLE.ADMIN && (
            <SystemMonitor data={data} activeUserStep={activeUserStep} forcedTab="RISK" />
          )}
          
          {userRole === USER_ROLE.OFFICER && (
            <SystemMonitor data={data} activeUserStep={activeUserStep} forcedTab="COLLECTIONS" />
          )}

          {userRole === USER_ROLE.CLIENT && (
            <ClientDashboard data={data} onStepChange={setActiveUserStep} />
          )}
        </main>

        {/* FOOTER - Minimalist, high density */}
        <footer className="h-10 md:h-12 border-t border-white/5 bg-black/90 backdrop-blur-3xl grid grid-cols-[1fr_auto] items-center px-4 md:px-12 text-[8px] md:text-[10px] font-mono text-slate-600 z-50 shrink-0">
          <div className="flex items-center gap-8 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-emerald-500 shadow-[0_0_10px_emerald]'}`}></span>
              <span className="font-black uppercase tracking-widest">Status: Authenticated // Path: {userRole}</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 overflow-hidden">
              <span className="font-black text-slate-800 shrink-0 uppercase tracking-tighter">Genesis_Block_Signature:</span>
              <span className="text-cyan-900 truncate font-bold text-[8px]">{data.lastAuditBlock.hash}</span>
            </div>
          </div>
          <div className="tracking-[0.8em] font-black uppercase italic ml-6 opacity-30 select-none hidden md:block">
            ZERO_TRUST_INFRASTRUCTURE
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
