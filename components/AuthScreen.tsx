
import React, { useState } from 'react';
import { USER_ROLE } from '../types';

interface AuthScreenProps {
  onLogin: (role: USER_ROLE) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<USER_ROLE | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const roles = [
    { 
      id: USER_ROLE.ADMIN, 
      label: 'Sovereign_Root', 
      desc: 'Infrastructure Control & Orchestration.',
      color: 'cyan',
      mockPass: 'ROOT_ALPHA_00',
      icon: '◈'
    },
    { 
      id: USER_ROLE.OFFICER, 
      label: 'Ops_Nexus', 
      desc: 'Performance Supervision.',
      color: 'purple',
      mockPass: 'OFFICER_BETA_22',
      icon: '⌬'
    },
    { 
      id: USER_ROLE.CLIENT, 
      label: 'Liquidity_Node', 
      desc: 'Settlement & Agreements.',
      color: 'emerald',
      mockPass: 'CLIENT_DELTA_44',
      icon: '≋'
    }
  ];

  const handleLogin = () => {
    if (!selectedRole) return;
    setIsAuthenticating(true);
    setTimeout(() => onLogin(selectedRole), 1800);
  };

  return (
    <div className="min-h-screen w-full bg-[#02040a] flex flex-col items-center justify-center p-4 sm:p-10 lg:p-20 relative overflow-hidden selection:bg-cyan-500/30">
      
      {/* Background Layer: Sin impacto en el layout */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-cyan-500/5 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-purple-500/5 blur-[150px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <div className="w-full max-w-[1800px] z-10 grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 xl:gap-32 items-center">
        
        {/* LADO IZQUIERDO: Branding & Vision */}
        <div className="flex flex-col space-y-8 md:space-y-12 text-center xl:text-left">
          <div className="flex flex-col lg:flex-row items-center xl:items-start gap-6 lg:gap-8">
            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-[2rem] flex items-center justify-center text-4xl sm:text-5xl font-black text-black shadow-2xl transition-transform hover:scale-105 active:rotate-3 shrink-0">Æ</div>
            <div className="flex flex-col">
              <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black text-white leading-[0.85] tracking-tighter uppercase italic">
                Aegis<br/><span className="text-white/10">Prime</span>
              </h1>
              <p className="text-[clamp(0.6rem,1.5vw,0.75rem)] font-mono text-cyan-500 font-black uppercase tracking-[0.5em] mt-4 opacity-70">
                Sovereign_Protocol_v6.4
              </p>
            </div>
          </div>

          <div className="max-w-xl mx-auto xl:mx-0 space-y-6">
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold text-white leading-[1.1] tracking-tight">
              Institutional-Grade<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500">
                Autonomous Capital.
              </span>
            </h2>
            <p className="text-slate-400 text-base sm:text-xl lg:text-2xl leading-relaxed opacity-80">
              Synchronizing global liquidity vectors with Zero-Trust biometric orchestration.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center xl:justify-start gap-6 pt-10 border-t border-white/5">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#02040a] bg-slate-900 flex items-center justify-center text-[8px] font-black ring-1 ring-white/10 text-slate-500 shadow-xl">NODE_{i}</div>
              ))}
            </div>
            <div className="text-left">
               <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black">+4,821 ACTIVE ENCLAVES</p>
               <span className="text-[9px] text-cyan-500/50 font-mono uppercase font-black">Cluster_Status: OPTIMAL</span>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Terminal de Acceso */}
        <div className="flex justify-center xl:justify-end">
          <div className="w-full max-w-[580px] glass rounded-[3rem] sm:rounded-[4.5rem] p-8 sm:p-12 lg:p-16 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
            
            <div className="mb-10 lg:mb-14">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Enclave_Gateway</span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">Access</h3>
            </div>
            
            <div className="grid gap-4 sm:gap-6 mb-10 lg:mb-14">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role.id); setPassword(role.mockPass); }}
                  className={`
                    group relative flex items-center justify-between p-6 sm:p-8 rounded-[2rem] border transition-all duration-500
                    ${selectedRole === role.id 
                      ? `bg-${role.color}-500/10 border-${role.color}-500/40 shadow-xl scale-[1.02]` 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20'}
                  `}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[1.2rem] flex items-center justify-center text-2xl sm:text-3xl font-black transition-all ${selectedRole === role.id ? `bg-${role.color}-500 text-black` : 'bg-white/5 text-slate-600'}`}>
                      {role.icon}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs sm:text-sm font-black uppercase tracking-widest ${selectedRole === role.id ? `text-${role.color}-400` : 'text-slate-500'}`}>
                        {role.label}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1 font-bold italic truncate max-w-[150px] sm:max-w-none">{role.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-6 lg:space-y-8">
              <input 
                type="password" value={password} readOnly placeholder="AUTH_KEY_REQUIRED"
                className="w-full bg-black/60 border border-white/10 rounded-2xl py-6 px-8 text-[10px] font-mono text-white/40 tracking-[0.5em] focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800"
              />
              <button
                onClick={handleLogin}
                disabled={!selectedRole || isAuthenticating}
                className={`
                  w-full py-6 sm:py-8 rounded-3xl font-black uppercase tracking-[0.6em] text-xs sm:text-sm transition-all relative overflow-hidden group
                  ${isAuthenticating 
                    ? 'bg-slate-900 text-slate-700' 
                    : selectedRole 
                      ? 'bg-white text-black hover:scale-[1.02] hover:shadow-2xl active:scale-95' 
                      : 'bg-white/5 text-white/5 cursor-not-allowed'}
                `}
              >
                {isAuthenticating ? 'Syncing_Nodes...' : 'Commit_Protocol'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 text-[8px] sm:text-[10px] font-mono text-slate-800 uppercase tracking-[1em] font-black text-center w-full px-4 opacity-40">
        Aegis_Global_Liquidity_Network
      </div>
    </div>
  );
};

export default AuthScreen;
