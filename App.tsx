
import React, { useState, useEffect, useCallback } from 'react';
import { bioSocket } from './services/mockSocketService';
import { RiskProfile, RiskLevel, UI_MODE, APPLICANT_FLOW_STEP, USER_ROLE } from './types';
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
        config: { responseMimeType: "application/json" }
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
    <div className={`h-screen w-screen grid grid-rows-[auto_1fr_auto] bg-[#02040a] overflow-hidden transition-all duration-1000 ${isCritical ? 'risk-critical' : ''}`}>
      
      {/* HEADER HUD */}
      <header className="h-16 border-b border-white/5 glass grid grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8 z-50">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-lg grid place-items-center font-black text-xs ${isCritical ? 'bg-red-600' : 'bg-cyan-600'} shadow-[0_0_15px_rgba(0,242,255,0.4)]`}>Æ</div>
          <div className="hidden sm:grid">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/90">Aegis_{userRole}</span>
            <span className="text-[7px] font-mono text-slate-500 uppercase">Sovereign_Cortex_V6.0</span>
          </div>
        </div>

        {/* Dynamic Navigation Based on Role */}
        <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 items-center">
           <span className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-white/5 mr-2">
             {userRole === USER_ROLE.ADMIN ? 'Infrastructure_View' : userRole === USER_ROLE.OFFICER ? 'Operations_Hub' : 'My_Vault'}
           </span>
           <button onClick={handleLogout} className="px-3 py-1.5 text-red-500 hover:bg-red-500/10 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">
             Disconnect
           </button>
        </div>

        <div className="flex items-center justify-end gap-3 md:gap-6">
          {userRole !== USER_ROLE.CLIENT && (
            <button 
              onClick={runAiAudit}
              disabled={isAuditing}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white/60 hover:text-white"
            >
              {isAuditing ? <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div> : <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]"></div>}
              <span className="text-[8px] font-black uppercase tracking-widest">Global_Audit</span>
            </button>
          )}
          <div className="grid text-right">
            <span className="text-[7px] font-mono text-slate-700 uppercase font-black">Node_Uplink</span>
            <span className="text-[9px] font-black text-white/80 font-mono">{new Date().toLocaleTimeString('en-GB', { hour12: false })}</span>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT - Persona Based Dashboards */}
      <main className="overflow-hidden relative bg-[#02040a]">
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

      {/* FOOTER */}
      <footer className="h-8 border-t border-white/5 bg-black/90 backdrop-blur-md grid grid-cols-[1fr_auto] items-center px-4 md:px-8 text-[7px] md:text-[9px] font-mono text-slate-700 z-50">
        <div className="flex items-center gap-6 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-emerald-500 shadow-[0_0_8px_emerald]'}`}></span>
            <span className="font-bold uppercase">Role: {userRole} // Enclave: Secured</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden truncate">
            <span className="font-black shrink-0">PKI_HASH:</span>
            <span className="text-cyan-900 truncate font-bold">{data.lastAuditBlock.hash}</span>
          </div>
        </div>
        <div className="tracking-[0.4em] font-black uppercase italic ml-4">
          ZERO_TRUST_ENCLAVE
        </div>
      </footer>
    </div>
  );
};

export default App;
