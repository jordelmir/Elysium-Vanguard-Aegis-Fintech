import React, { useState, useEffect } from 'react';
import { bioSocket } from './services/mockSocketService';
import { RiskProfile, RiskLevel } from './types';
import RiskRadar from './components/RiskRadar';
import StatCard from './components/StatCard';
import ForensicPanel from './components/ForensicPanel';
import DetailModal from './components/DetailModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

const App: React.FC = () => {
  const [profile, setProfile] = useState<RiskProfile | null>(null);
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalColor, setModalColor] = useState("bg-cyan-500");

  // Subscription to "WebSocket"
  useEffect(() => {
    const unsubscribe = bioSocket.subscribe((data) => {
      setProfile(data);
    });

    const timeInterval = setInterval(() => {
        setSystemTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(timeInterval);
    };
  }, []);

  const handleStatClick = (title: string, color: string) => {
      setModalTitle(title);
      setModalColor(color);
      setModalOpen(true);
  };

  const handleScenario = (scenario: 'BREACH' | 'NORMAL') => {
      bioSocket.triggerScenario(scenario);
  };

  if (!profile) return <div className="bg-black h-screen w-screen flex items-center justify-center text-cyan-500 font-mono text-xl animate-pulse">INITIALIZING BIO-DIGITAL LINK...</div>;

  const isCritical = profile.siprScore > 0.85;

  return (
    <div className={`
        fixed inset-0 w-full h-full bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 
        flex flex-col transition-all duration-1000
        ${isCritical ? 'shadow-[inset_0_0_100px_rgba(220,38,38,0.3)] bg-red-950/10' : ''}
    `}>
      
      {/* Background Digital Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* 1. Header (Fixed) */}
      <header className="h-16 flex-shrink-0 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 z-50 shadow-md relative">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-white text-lg shadow-lg transition-colors duration-500 ${isCritical ? 'bg-red-600 shadow-red-500/20' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20'}`}>
            A
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold tracking-widest uppercase text-slate-100">Project Aegis</h1>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider">PROTOCOLO BIO-DIGITAL v.ZERO-TRUST</div>
          </div>
        </div>

        {/* Desktop Status Indicators */}
        <div className="hidden md:flex items-center space-x-6 font-mono text-xs">
           <div className="flex items-center space-x-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_5px_#10b981]"></span>
             <span className="text-slate-400">JAVA_CORE:</span>
             <span className="text-emerald-400">ONLINE</span>
           </div>
           <div className="flex items-center space-x-2">
             <span className={`w-2 h-2 rounded-full animate-pulse ${isCritical ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-purple-500 shadow-[0_0_5px_#a855f7]'}`}></span>
             <span className="text-slate-400">GEMINI_1.5:</span>
             <span className={isCritical ? 'text-red-400 font-bold' : 'text-purple-400'}>
                 {isCritical ? 'ALERT MODE' : 'REASONING'}
             </span>
           </div>
           <div className="text-slate-500 border-l border-slate-800 pl-6">
             {systemTime}
           </div>
        </div>
        
        {/* Mobile Time */}
        <div className="md:hidden font-mono text-xs text-slate-500">
            {systemTime}
        </div>
      </header>

      {/* 2. Main Scrollable Area */}
      {/* 
          LAYOUT STRATEGY:
          - Mobile: overflow-y-auto allows the whole content area to scroll.
          - Desktop: We still allow overflow-y-auto for safety, but the inner grid tries to fit within height.
      */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-0 custom-scrollbar">
          <main className="p-4 lg:p-6 w-full max-w-[1920px] mx-auto min-h-full flex flex-col lg:grid lg:grid-cols-12 lg:gap-6">
            
            {/* LEFT COLUMN: Visual Cortex (Risk Radar) */}
            <div className="col-span-1 lg:col-span-5 flex flex-col space-y-4">
              
              {/* Command Center (Simulation Controls) */}
              <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                 <button 
                    onClick={() => handleScenario('BREACH')}
                    className="bg-red-950/20 border border-red-900/40 hover:bg-red-900/40 hover:border-red-500/50 text-red-400 text-xs font-mono py-3 rounded transition-all uppercase tracking-wider flex items-center justify-center gap-2 group"
                 >
                    <span className="w-2 h-2 rounded-full bg-red-500 opacity-50 group-hover:opacity-100 group-hover:animate-ping"></span>
                    Simulate Breach
                 </button>
                 <button 
                    onClick={() => handleScenario('NORMAL')}
                    className="bg-cyan-950/20 border border-cyan-900/40 hover:bg-cyan-900/40 hover:border-cyan-500/50 text-cyan-400 text-xs font-mono py-3 rounded transition-all uppercase tracking-wider flex items-center justify-center gap-2 group"
                 >
                    <span className="w-2 h-2 rounded-full bg-cyan-500 opacity-50 group-hover:opacity-100"></span>
                    Normalize System
                 </button>
              </div>

              {/* Risk Radar Container */}
              {/* On mobile: fixed height. On Desktop: fills remaining space */}
              <div className="h-[350px] lg:h-[calc(100vh-14rem)] bg-slate-900/50 rounded-2xl border border-slate-800 relative overflow-hidden shadow-2xl flex flex-col group transition-colors duration-500 hover:border-slate-700">
                 {/* Dynamic Warning Overlay */}
                 {isCritical && (
                    <div className="absolute inset-0 z-20 pointer-events-none border-[4px] border-red-500/50 animate-pulse rounded-2xl flex items-center justify-center">
                        <div className="bg-red-950/90 backdrop-blur text-red-500 px-6 py-4 rounded-xl border border-red-500 font-mono font-bold tracking-widest text-xl text-center shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                            ⚠ SIPR THRESHOLD EXCEEDED
                        </div>
                    </div>
                 )}

                 <div className="flex-1 relative">
                    <RiskRadar siprScore={profile.siprScore} />
                 </div>
                 
                 {/* Bottom Overlay Data */}
                 <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-slate-400 text-[10px] font-mono mb-1 uppercase tracking-wider">Applicant Identity</div>
                            <div className="text-xl font-mono text-white tracking-widest">{profile.applicantId}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-slate-400 text-[10px] font-mono mb-1 uppercase tracking-wider">Insolvency Probability</div>
                            <div className={`text-4xl font-mono font-bold tracking-tighter ${isCritical ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]'}`}>
                                {(profile.siprScore * 100).toFixed(2)}%
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Data Density & Forensics */}
            <div className="col-span-1 lg:col-span-7 flex flex-col space-y-4 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
              
              {/* Top Row: KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 flex-shrink-0">
                 <StatCard 
                    label="SIPR SCORE" 
                    value={profile.siprScore.toFixed(3)} 
                    status={profile.siprScore > 0.85 ? 'danger' : profile.siprScore > 0.6 ? 'warning' : 'success'}
                    onClick={() => handleStatClick("SIPR SCORE ANALYSIS", "bg-red-500")}
                 />
                 <StatCard 
                    label="INTEGRITY" 
                    value={`${(profile.forensicIntegrityScore * 100).toFixed(1)}%`} 
                    status={profile.forensicIntegrityScore < 0.9 ? 'warning' : 'success'}
                    onClick={() => handleStatClick("FORENSIC INTEGRITY AUDIT", "bg-emerald-500")}
                 />
                 <StatCard 
                    label="RISK LEVEL" 
                    value={profile.riskLevel} 
                    isMonospace={false}
                    status={profile.riskLevel === 'CRITICAL' || profile.riskLevel === 'HIGH' ? 'danger' : 'neutral'}
                 />
                 <StatCard 
                    label="LAST AUDIT" 
                    value={profile.lastAuditBlock.timestamp.split('T')[1].split('.')[0]} 
                    subValue={`BLK: ${profile.lastAuditBlock.blockId.substring(4)}`}
                 />
              </div>

              {/* Middle Row: Vector Saturation & Forensics */}
              {/* On Desktop, this fills remaining height. On Mobile, it has min height. */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 min-h-[500px] lg:min-h-0 lg:overflow-hidden">
                 
                 {/* Vector Saturation Chart */}
                 <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col h-full overflow-hidden hover:border-slate-700 transition-colors">
                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                        <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                           Financial Vector Saturation
                        </h3>
                    </div>
                    <div className="flex-1 w-full min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={profile.vectors} layout="vertical" barSize={20} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis 
                                    dataKey="dimension" 
                                    type="category" 
                                    width={100} 
                                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl">
                                                <p className="text-slate-300 text-xs font-mono">{payload[0].payload.dimension}</p>
                                                <p className="text-cyan-400 text-sm font-bold">{payload[0].value}% SATURATION</p>
                                            </div>
                                        );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={1000}>
                                    {profile.vectors.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.value > 80 ? '#ef4444' : entry.value > 50 ? '#f59e0b' : '#0ea5e9'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Forensic Anomalies List */}
                 <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 h-full overflow-hidden flex flex-col hover:border-slate-700 transition-colors">
                    <ForensicPanel anomalies={profile.anomalies} />
                 </div>

              </div>
            </div>
          </main>
          
          {/* Spacer for Fixed Footer */}
          <div className="h-8 w-full flex-shrink-0"></div>
      </div>

      {/* 3. Footer: Immutable Ledger Strip (Fixed Bottom) */}
      <footer className="h-8 absolute bottom-0 left-0 w-full bg-slate-950 border-t border-slate-800 flex items-center px-4 space-x-4 text-[10px] font-mono text-slate-500 overflow-hidden whitespace-nowrap z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center text-emerald-500 font-bold bg-slate-950 pr-4 z-10">
            <svg className="w-3 h-3 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            LEDGER_SYNCED
        </div>
        <div className="flex-1 flex space-x-12 opacity-70 animate-[marquee_30s_linear_infinite]">
            <span className="flex items-center"><span className="text-slate-700 mr-2">PREV:</span> <span className="text-slate-500">{profile.lastAuditBlock.previousHash.substring(0, 24)}...</span></span>
            <span className="flex items-center"><span className="text-slate-700 mr-2">CURR:</span> <span className="text-slate-300 font-bold">{profile.lastAuditBlock.hash.substring(0, 32)}...</span></span>
            <span className="flex items-center"><span className="text-slate-700 mr-2">ACTOR:</span> <span className="text-cyan-600">{profile.lastAuditBlock.actor}</span></span>
            <span className="flex items-center"><span className="text-slate-700 mr-2">BLK_ID:</span> {profile.lastAuditBlock.blockId}</span>
        </div>
      </footer>

      {/* Drill Down Modal */}
      <DetailModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        color={modalColor}
        data={bioSocket.getHistory(modalTitle)}
      />

    </div>
  );
};

export default App;