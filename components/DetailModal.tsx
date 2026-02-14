import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DetailModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  data: { time: string; value: number }[];
  color: string;
}

const DetailModal: React.FC<DetailModalProps> = ({ title, isOpen, onClose, data, color }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wider flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-3 ${color}`}></span>
                    {title}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-1">HISTORICAL ANALYSIS VECTOR</p>
            </div>
            <button 
                onClick={onClose}
                className="text-slate-500 hover:text-white transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="h-64 w-full bg-slate-950/50 rounded-lg border border-slate-800 p-4">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="#475569" fontSize={12} />
                    <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155'}}
                        itemStyle={{color: '#fff'}}
                    />
                    <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#22d3ee" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                    />
                </AreaChart>
             </ResponsiveContainer>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-semibold transition-colors"
            >
                CLOSE VIEW
            </button>
            <button className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(8,145,178,0.4)]">
                EXPORT REPORT
            </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;