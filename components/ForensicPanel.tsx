import React, { useState } from 'react';
import { Anomaly, AnomalyType } from '../types';

interface ForensicPanelProps {
  anomalies: Anomaly[];
}

const AnomalyItem: React.FC<{ anomaly: Anomaly }> = ({ anomaly }) => {
  const [status, setStatus] = useState<'DETECTED' | 'INVESTIGATING' | 'RESOLVED'>('DETECTED');

  const typeColors = {
    [AnomalyType.BEHAVIORAL]: 'text-purple-400 border-purple-500/30 bg-purple-900/10',
    [AnomalyType.METADATA]: 'text-cyan-400 border-cyan-500/30 bg-cyan-900/10',
    [AnomalyType.TEMPORAL]: 'text-amber-400 border-amber-500/30 bg-amber-900/10',
    [AnomalyType.TYPOGRAPHIC]: 'text-pink-400 border-pink-500/30 bg-pink-900/10',
  };

  const statusStyles = {
    DETECTED: '',
    INVESTIGATING: 'ring-1 ring-yellow-500/50 bg-yellow-900/10',
    RESOLVED: 'opacity-50 grayscale'
  };

  const handleInteraction = () => {
    if (status === 'DETECTED') setStatus('INVESTIGATING');
    else if (status === 'INVESTIGATING') setStatus('RESOLVED');
  };

  return (
    <div
      onClick={handleInteraction}
      className={`
            p-3 border rounded-md mb-2 flex items-start space-x-3 cursor-pointer transition-all duration-200 hover:bg-white/5
            ${typeColors[anomaly.type]}
            ${statusStyles[status]}
        `}
    >
      <div className="mt-1">
        {status === 'INVESTIGATING' ? (
          <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin"></div>
        ) : status === 'RESOLVED' ? (
          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        ) : (
          <>
            {anomaly.type === AnomalyType.BEHAVIORAL && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            {anomaly.type === AnomalyType.METADATA && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            {anomaly.type === AnomalyType.TEMPORAL && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            {anomaly.type === AnomalyType.TYPOGRAPHIC && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
          </>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase flex items-center gap-2">
            {anomaly.type}
            {status !== 'DETECTED' && <span className="text-[9px] px-1 bg-black/30 rounded">{status}</span>}
          </h4>
          <span className="text-[10px] opacity-70 font-mono">{anomaly.id}</span>
        </div>
        <p className="text-sm mt-1 leading-tight opacity-90">{anomaly.description}</p>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-slate-400">{new Date(anomaly.detectedAt).toLocaleTimeString()}</span>
          <span className="text-[10px] font-bold">SEVERITY: {(anomaly.severity * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

const ForensicPanel: React.FC<ForensicPanelProps> = ({ anomalies }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold tracking-tight flex items-center">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
          FORENSIC ANOMALIES
        </h3>
        <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-300">
          LIVE FEED
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        {(anomalies || []).length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-lg text-slate-500 text-sm p-4">
            <span className="mb-2 text-2xl">🛡️</span>
            NO ANOMALIES DETECTED
            <span className="text-xs opacity-50 mt-1">System is operating within normal vectors.</span>
          </div>
        ) : (
          (anomalies || []).map((anm) => <AnomalyItem key={anm.id} anomaly={anm} />)
        )}
      </div>
    </div>
  );
};

export default ForensicPanel;