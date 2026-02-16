
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
      desc: 'Full infrastructure control and orchestration.',
      color: 'cyan',
      mockPass: 'ROOT_ALPHA_00',
      icon: '◈'
    },
    { 
      id: USER_ROLE.OFFICER, 
      label: 'Ops_Nexus', 
      desc: 'Collection management and performance supervision.',
      color: 'purple',
      mockPass: 'OFFICER_BETA_22',
      icon: '⌬'
    },
    { 
      id: USER_ROLE.CLIENT, 
      label: 'Liquidity_Node', 
      desc: 'Portal for payments, settlement, and agreements.',
      color: 'emerald',
      mockPass: 'CLIENT_DELTA_44',
      icon: '≋'
    }
  ];

  const handleSelect = (role: USER_ROLE, pass: string) => {
    setSelectedRole(role);
    setPassword(pass);
  };

  const handleLogin = () => {
    if (!selectedRole) return;
    setIsAuthenticating(true);
    setTimeout(() => {
      onLogin(selectedRole);
    }, 1800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 lg:p-20 relative overflow-y-auto bg-[#02040a]">
      
      {/* HUD Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-500/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,4px_100%] opacity-20"></div>
      </div>
      
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-32 items-center relative z-10 py-10 lg:py-0">
        
        {/* Left Section: Identity & Vision */}
        <div className="flex flex-col space-y-10 md:space-y-16 animate-in slide-in-from-left-12 duration-1000 text-center lg:text-left">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 group">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center font-black text-4xl md:text-5xl text-black shadow-[0_0_60px_rgba(255,255,255,0.1)] transition-all duration-700 group-hover:scale-105 group-hover:rotate-3">Æ</div>
              <div className="flex flex-col">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.85] italic">
                  Aegis <span className="text-white/10 group-hover:text-white/30 transition-colors duration-1000">Prime</span>
                </h1>
                <p className="text-xs md:text-sm font-mono text-cyan-500 font-black uppercase tracking-[0.8em] mt-4 opacity-70">Sovereign_Risk_Cortex_v6</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8 max-w-2xl mx-auto lg:mx-0">
            <h2 className="text-3xl md:text-5xl font-bold text-white/95 leading-[1.1] tracking-tight">
              Welcome to the epicenter of <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Intelligent Capital.</span>
            </h2>
            <p className="text-slate-400 text-base md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
              Initiating Zero-Trust link sequence. Aegis is processing liquidity vectors in real-time.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-6 border-t border-white/5">
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#02040a] bg-slate-800 flex items-center justify-center text-[10px] font-black shadow-xl ring-1 ring-white/10">U{i}</div>
                ))}
              </div>
              <div className="flex flex-col text-left">
                 <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-black">+1,248 Nodes Active</p>
                 <span className="text-[9px] text-cyan-500/50 font-mono uppercase">Global_Inference_Stable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Access Terminal */}
        <div className="w-full relative">
          <div className="glass rounded-[3rem] md:rounded-[4.5rem] p-8 md:p-16 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden animate-in zoom-in-95 duration-1000 delay-200">
            
            <div className="mb-12 md:mb-16">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] block mb-3 opacity-50 font-mono">Secured_Entry_Point</span>
              <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Select your Enclave</h3>
            </div>
            
            {/* Role Matrix Grid */}
            <div className="grid gap-4 md:gap-5 mb-12">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleSelect(role.id, role.mockPass)}
                  className={`
                    group relative flex items-center justify-between p-6 md:p-8 rounded-[2rem] border transition-all duration-700
                    ${selectedRole === role.id 
                      ? `bg-${role.color}-500/10 border-${role.color}-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-[1.02]` 
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'}
                  `}
                >
                  <div className="flex items-center gap-6">
                    <div className={`
                      w-12 h-12 md:w-16 md:h-16 rounded-[1.25rem] md:rounded-[1.5rem] flex items-center justify-center text-2xl md:text-3xl font-black transition-all duration-700
                      ${selectedRole === role.id ? `bg-${role.color}-500 text-black shadow-[0_0_20px_currentColor]` : 'bg-white/5 text-slate-500 group-hover:text-white group-hover:scale-110'}
                    `}>
                      {role.icon}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs md:text-sm font-black uppercase tracking-[0.2em] ${selectedRole === role.id ? `text-${role.color}-400` : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {role.label}
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-600 mt-1 font-medium italic truncate max-w-[150px] md:max-w-none">{role.desc}</p>
                    </div>
                  </div>
                  {selectedRole === role.id && (
                    <div className={`w-2 h-2 rounded-full bg-${role.color}-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-pulse`}></div>
                  )}
                </button>
              ))}
            </div>

            {/* Access Controller */}
            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute inset-y-0 left-8 flex items-center text-slate-700 group-focus-within:text-cyan-500 transition-colors duration-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  type="password" 
                  value={password}
                  readOnly
                  placeholder="ENCRYPTED_AUTH_TOKEN"
                  className="w-full bg-black/40 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-xs font-mono text-white/40 tracking-[0.4em] focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={!selectedRole || isAuthenticating}
                className={`
                  w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.6em] text-xs md:text-sm transition-all duration-700 relative overflow-hidden group
                  ${isAuthenticating 
                    ? 'bg-slate-900 text-slate-700' 
                    : selectedRole 
                      ? 'bg-white text-black hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(255,255,255,0.2)] active:scale-95' 
                      : 'bg-white/5 text-white/10 cursor-not-allowed'}
                `}
              >
                {isAuthenticating ? (
                  <div className="flex items-center justify-center gap-5">
                    <div className="w-5 h-5 border-3 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
                    <span className="animate-pulse tracking-[0.2em]">Executing Sequence...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Initiate Protocol</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </button>
            </div>

            {/* Micro Terminal Decors */}
            <div className="absolute top-0 left-20 w-[1px] h-10 bg-gradient-to-b from-white/10 to-transparent"></div>
            <div className="absolute bottom-0 right-20 w-[1px] h-10 bg-gradient-to-t from-white/10 to-transparent"></div>
          </div>
          
          {/* Footer Metadata */}
          <div className="mt-10 flex flex-col md:flex-row justify-between items-center px-8 gap-4">
             <div className="flex items-center gap-4">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_emerald]"></span>
               <span className="text-[10px] font-mono text-slate-600 uppercase font-black tracking-widest">Global_Nexus_Active</span>
             </div>
             <span className="text-[9px] font-mono text-slate-800 uppercase font-black tracking-widest italic">Aegis_Cortex_v6.0.4_Stable_Build</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-12 text-[10px] font-mono text-slate-900 uppercase tracking-[1em] font-black pointer-events-none opacity-50 italic">
        Secured_By_Project_Aegis_Global
      </div>
    </div>
  );
};

export default AuthScreen;
