
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
      desc: 'Infrastructure Control & High-Level Monitoring.',
      color: 'cyan',
      mockPass: 'ROOT_ALPHA_00',
      icon: '◈'
    },
    {
      id: USER_ROLE.OFFICER,
      label: 'Ops_Nexus',
      desc: 'Operational Supervision & Recovery Management.',
      color: 'purple',
      mockPass: 'OFFICER_BETA_22',
      icon: '⌬'
    },
    {
      id: USER_ROLE.CLIENT,
      label: 'Liquidity_Node',
      desc: 'User Portal for Capital Settlement & Negotiation.',
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-10 lg:p-20 relative bg-transparent selection:bg-cyan-500/30">

      {/* Subtle Space Atmosphere Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] bg-cyan-600/5 blur-[200px] rounded-full animate-pulse opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] bg-indigo-600/5 blur-[200px] rounded-full animate-pulse [animation-delay:2s] opacity-30"></div>
      </div>

      <div className="w-full max-w-[1800px] z-10 grid grid-cols-1 xl:grid-cols-2 gap-20 items-center py-12">

        {/* LEFT: Branding */}
        <div className="flex flex-col space-y-12 text-center xl:text-left">
          <div className="space-y-10">
            <div className="flex flex-col xl:flex-row items-center xl:items-start gap-10 entrance-bloom">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-5xl sm:text-6xl font-black text-black shadow-2xl shrink-0 neon-breathing hover-glitch">Æ</div>
              <div className="grid gap-2">
                <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-black text-white leading-[0.8] tracking-tighter uppercase italic">
                  Aegis<br /><span className="text-white/10">Prime</span>
                </h1>
                <p className="text-[10px] font-mono text-cyan-500 font-black uppercase tracking-[1em] mt-4 opacity-70">Protocol_v6.4.2</p>
              </div>
            </div>

            <div className="max-w-xl mx-auto xl:mx-0 space-y-8">
              <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-bold text-white leading-[1] tracking-tight">
                Institutional-Grade<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500">
                  Autonomous Capital.
                </span>
              </h2>
              <p className="text-slate-400 text-lg sm:text-2xl leading-relaxed opacity-80 font-medium">
                Synchronizing global liquidity vectors with Zero-Trust biometric orchestration.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center xl:justify-start gap-8 pt-12 border-t border-white/5">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-[#02040a] bg-slate-900 flex items-center justify-center text-[10px] font-black ring-1 ring-white/10 text-slate-500 shadow-2xl">NODE_{i}</div>
              ))}
            </div>
            <div className="text-left">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest font-black leading-none mb-2">+4,821 ACTIVE ENCLAVES</p>
              <span className="text-[10px] text-cyan-500/50 font-mono uppercase font-black tracking-widest">Cluster_Status: OPTIMAL_UPLINK</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Terminal */}
        <div className="flex justify-center xl:justify-end entrance-bloom [animation-delay:0.2s]">
          <div className="w-full max-w-[650px] glass-vanguard rounded-[4rem] p-10 sm:p-16 lg:p-20 border-white/10 shadow-[0_50px_150px_rgba(0,0,0,0.8)] relative overflow-hidden neon-breathing">

            <div className="mb-14">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] font-mono">Enclave_Gateway</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Access</h3>
            </div>

            <div className="grid gap-6 mb-14">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => { setSelectedRole(role.id); setPassword(role.mockPass); }}
                  className={`
                    group relative flex items-center justify-between p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-500
                    ${selectedRole === role.id
                      ? role.color === 'red' ? 'bg-red-500/10 border-red-500/40 shadow-2xl scale-[1.02]'
                        : role.color === 'amber' ? 'bg-amber-500/10 border-amber-500/40 shadow-2xl scale-[1.02]'
                          : 'bg-emerald-500/10 border-emerald-500/40 shadow-2xl scale-[1.02]'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/20'}
                  `}
                >
                  <div className="flex items-center gap-5 md:gap-8">
                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl font-black transition-all ${selectedRole === role.id ? (role.color === 'red' ? 'bg-red-500 text-black' : role.color === 'amber' ? 'bg-amber-500 text-black' : 'bg-emerald-500 text-black') : 'bg-white/5 text-slate-700'}`}>
                      {role.icon}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs md:text-sm font-black uppercase tracking-widest ${selectedRole === role.id ? (role.color === 'red' ? 'text-red-400' : role.color === 'amber' ? 'text-amber-400' : 'text-emerald-400') : 'text-slate-500'}`}>
                        {role.label}
                      </p>
                      <p className="text-[10px] md:text-[11px] text-slate-600 mt-1 md:mt-2 font-bold italic leading-tight">{role.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-8">
              <input
                type="password" value={password} readOnly placeholder="AUTH_KEY_REQUIRED"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-7 px-10 text-xs font-mono text-cyan-400/40 tracking-[0.8em] focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-800"
              />
              <button
                onClick={handleLogin}
                disabled={!selectedRole || isAuthenticating}
                className={`
                  w-full py-8 rounded-[2.5rem] font-black uppercase tracking-[1em] text-sm transition-all relative overflow-hidden group hover-glitch
                  ${isAuthenticating
                    ? 'bg-slate-900 text-slate-700'
                    : selectedRole
                      ? 'bg-white text-black hover:scale-[1.02] hover:shadow-2xl active:scale-95'
                      : 'bg-white/5 text-white/10 cursor-not-allowed'}
                `}
              >
                {isAuthenticating ? 'Syncing_Core...' : 'Commit_Protocol'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
