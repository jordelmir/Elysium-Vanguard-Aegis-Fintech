import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  isMonospace?: boolean;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subValue, status = 'neutral', isMonospace = true, onClick }) => {
  const statusColors = {
    success: 'border-emerald-500/30 text-emerald-400 group-hover:border-emerald-500/60',
    warning: 'border-amber-500/30 text-amber-400 group-hover:border-amber-500/60',
    danger: 'border-red-500/50 text-red-500 animate-pulse group-hover:border-red-500',
    neutral: 'border-slate-700 text-slate-200 group-hover:border-slate-500',
  };

  const bgStatus = {
     success: 'bg-emerald-950/20 group-hover:bg-emerald-950/30',
     warning: 'bg-amber-950/20 group-hover:bg-amber-950/30',
     danger: 'bg-red-950/30 group-hover:bg-red-950/40',
     neutral: 'bg-slate-800/20 group-hover:bg-slate-800/40'
  }

  return (
    <div 
      onClick={onClick}
      className={`
      relative p-4 rounded-xl border backdrop-blur-md transition-all duration-300 group
      ${statusColors[status].split(' ')[0]}
      ${bgStatus[status]}
      ${onClick ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}
    `}>
      <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center justify-between">
        {label}
        {onClick && (
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        )}
      </div>
      <div className={`text-2xl font-bold ${statusColors[status].split(' ').slice(1).join(' ')} ${isMonospace ? 'font-mono' : ''}`}>
        {value}
      </div>
      {subValue && (
        <div className="text-xs text-slate-500 mt-1 font-mono">{subValue}</div>
      )}
      
      {/* Corner Decoration */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-50"></div>
    </div>
  );
};

export default StatCard;