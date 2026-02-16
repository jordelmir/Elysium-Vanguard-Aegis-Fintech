
import React from 'react';
import { BackendMetrics } from '../types';

interface BackendPulseProps {
  metrics: BackendMetrics;
}

const BackendPulse: React.FC<BackendPulseProps> = ({ metrics }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between group hover:border-cyan-500/30 transition-all">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">Virtual_Threads (Loom)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-white font-mono tracking-tighter">{metrics.virtualThreads.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-500 animate-pulse font-black font-mono">POOL_ACTIVE</span>
          </div>
        </div>
        <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between group hover:border-purple-500/30 transition-all">
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-black">JVM_Heap_Pressure</span>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-white font-black">{metrics.heapUsage.toFixed(1)}%</span>
                <span className="text-slate-700">8GB_MEM_MAX</span>
            </div>
            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ${metrics.heapUsage > 80 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-cyan-500 shadow-[0_0_8px_cyan]'}`} 
                  style={{width: `${metrics.heapUsage}%`}}
                ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-3 font-black">
                <span className={`w-2 h-2 rounded-full ${metrics.gcActivity === 'IDLE' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping shadow-[0_0_10px_orange]'}`}></span>
                GC_Collector: ZGC_Native
            </span>
            <div className="flex flex-col items-end">
               <span className="text-[11px] font-mono text-cyan-500 font-black tracking-tighter">P99: {metrics.p99Latency.toFixed(3)}ms</span>
               <span className="text-[7px] text-slate-700 font-black uppercase">Institutional_Grade</span>
            </div>
        </div>
        <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-mono text-slate-600 uppercase font-black tracking-widest">Kafka_Ingress_Stream</span>
            <div className="text-[11px] font-mono text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap bg-black/60 p-2 rounded-lg border border-white/5">
                OFFSET: <span className="text-emerald-500 font-black">{metrics.kafkaOffset}</span> | TPC: risk.realtime.telemetry
            </div>
        </div>
      </div>
    </div>
  );
};

export default BackendPulse;
