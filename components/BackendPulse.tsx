
import React from 'react';
import { BackendMetrics } from '../types';

interface BackendPulseProps {
  metrics: BackendMetrics;
}

const BackendPulse: React.FC<BackendPulseProps> = ({ metrics }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 border border-white/5 p-3 rounded flex flex-col justify-between">
          <span className="text-[8px] font-mono text-slate-500 uppercase">Virtual Threads (Loom)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-cyan-400 font-mono">{metrics.virtualThreads.toLocaleString()}</span>
            <span className="text-[9px] text-emerald-500 animate-pulse font-bold">ACTV</span>
          </div>
        </div>
        <div className="bg-black/40 border border-white/5 p-3 rounded flex flex-col justify-between">
          <span className="text-[8px] font-mono text-slate-500 uppercase">JVM Heap Utilization</span>
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white font-bold">{metrics.heapUsage.toFixed(1)}%</span>
                <span className="text-slate-600">8GB_MAX</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 transition-all duration-500" style={{width: `${metrics.heapUsage}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/5 p-3 rounded space-y-3">
        <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${metrics.gcActivity === 'IDLE' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`}></span>
                GC Status: {metrics.gcActivity}
            </span>
            <span className="text-[10px] font-mono text-cyan-500 font-bold">P99: {metrics.p99Latency.toFixed(2)}ms</span>
        </div>
        <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-slate-600 uppercase">Kafka Stream Ingress</span>
            <div className="text-[11px] font-mono text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap">
                OFFSET_HEAD: <span className="text-emerald-500">{metrics.kafkaOffset}</span> | TOPIC: fintech.risk.telemetry
            </div>
        </div>
      </div>
    </div>
  );
};

export default BackendPulse;
