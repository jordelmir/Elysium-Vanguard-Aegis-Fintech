
import React, { useState, useEffect, useCallback } from 'react';
import { bioSocket } from './services/mockSocketService';
import { RiskProfile, RiskLevel, APPLICANT_FLOW_STEP, USER_ROLE } from './types';
import SystemMonitor from './components/SystemMonitor';
import ClientDashboard from './components/ClientDashboard';
import AuthScreen from './components/AuthScreen';
import ErrorBoundary from './components/ErrorBoundary';
import SpaceView from './components/SpaceView';
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

  const handleLogin = (role: USER_ROLE, name: string) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const runAiAudit = useCallback(async () => {
    if (!data || isAuditing) return;
    setIsAuditing(true);
    try {
      // Use VITE_API_KEY from environment
      const apiKey = (import.meta as any).env?.VITE_API_KEY;
      if (!apiKey) throw new Error("API_KEY_MISSING");

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Act as a senior risk auditor for Project Aegis. Analyze this data packet: ${JSON.stringify(data)}. 
      Return a JSON object with: verdict, reasoning (3 technical points), and confidence (0-1).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json"
        }
      });

      const auditResult = JSON.parse(response.text() || "{}");
      setData(prev => prev ? { ...prev, aiAudit: auditResult } : null);
    } catch (e) {
      console.error("Audit Fail:", e);
    } finally {
      setIsAuditing(false);
    }
  }, [data, isAuditing]);

  if (!isLoggedIn) {
    return (
      <div className="h-screen w-screen overflow-hidden relative">
        <SpaceView />
        <AuthScreen onLogin={handleLogin} />
      </div>
    );
  }

  const isCritical = data?.riskLevel === RiskLevel.CRITICAL;

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col relative transition-all duration-1000 ${isCritical ? 'risk-critical' : ''}`}>
      <SpaceView />

      {/* GLOBAL HUD OVERLAY */}
      <header className="fixed top-0 left-0 right-0 z-50 h-20 glass-vanguard flex items-center justify-between px-8 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div
            onClick={handleLogout}
            className={`w-12 h-12 rounded-2xl grid place-items-center font-black text-xl italic cursor-pointer transition-all hover:scale-110 active:scale-95 neon-breathing ${isCritical ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-cyan-500/20 text-cyan-500 border-cyan-500/50'}`}
          >
            Æ
          </div>
          <div>
            <h1 className="text-[10px] font-mono tracking-[0.5em] uppercase opacity-40">Sovereign_Cortex</h1>
            <p className="text-xl font-black italic tracking-tighter uppercase leading-none flex items-center gap-2">
              Aegis <span className="text-[10px] opacity-20 font-normal tracking-widest">//</span> Vanguard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          {userRole === USER_ROLE.ADMIN && (
            <button
              onClick={runAiAudit}
              disabled={isAuditing}
              className="px-6 py-2.5 glass-vanguard rounded-xl flex items-center gap-3 hover:bg-white/5 transition-all group border border-white/5"
            >
              <div className={`w-2 h-2 rounded-full ${isAuditing ? 'animate-ping bg-cyan-400' : 'bg-cyan-500 group-hover:scale-150 transition-transform'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] font-mono text-slate-400 group-hover:text-white">Cognitive_Audit</span>
            </button>
          )}

          <div className="hidden lg:flex flex-col items-end gap-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Uplink_Sync [STABLE]</span>
            <span className="text-lg font-black font-mono text-white/90 tracking-tighter">
              {new Date().toLocaleTimeString('en-GB', { hour1: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 glass-vanguard border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-lg"
          >
            Exit_Enclave
          </button>
        </div>
      </header>

      <main className="flex-1 pt-20 relative overflow-hidden flex flex-col">
        <ErrorBoundary>
          {userRole === USER_ROLE.ADMIN ? (
            <SystemMonitor data={data} activeUserStep={activeUserStep} />
          ) : userRole === USER_ROLE.OFFICER ? (
            <SystemMonitor data={data} activeUserStep={activeUserStep} forcedTab="COLLECTIONS" />
          ) : (
            <ClientDashboard data={data} onStepChange={setActiveUserStep} />
          )}
        </ErrorBoundary>
      </main>

      <footer className="h-10 glass-vanguard !bg-black/90 px-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-4 text-[9px] font-mono tracking-widest uppercase text-slate-500">
          <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
          <span>Role: {userRole}</span>
          <span className="opacity-20">//</span>
          <span>Net: Secure_TLS_1.3</span>
          <span className="opacity-20">//</span>
          <span>Cluster: <span className="text-cyan-400">AEGIS-SENTRY-01</span></span>
        </div>
        <div className="text-[10px] font-mono text-slate-600 font-bold tracking-[0.6em] uppercase italic">
          Project Vanguard // Sentinel Edition
        </div>
      </footer>
    </div>
  );
};

export default App;
