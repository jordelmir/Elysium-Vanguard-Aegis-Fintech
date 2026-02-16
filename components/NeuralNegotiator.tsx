
import React, { useState, useEffect, useRef } from 'react';
import { CollectionCase } from '../types';
import { GoogleGenAI } from '@google/genai';

interface Attachment {
  mimeType: string;
  data: string; // Base64
  fileName: string;
}

interface Message {
  id: string;
  role: 'AI_AGENT' | 'USER' | 'SYSTEM';
  text: string;
  timestamp: string;
  attachment?: Attachment;
  metadata?: any;
}

interface NeuralNegotiatorProps {
  activeCase: CollectionCase | null;
}

const NeuralNegotiator: React.FC<NeuralNegotiatorProps> = ({ activeCase }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<any[]>([]);
  const lastLoanId = useRef<string | null>(null);

  const suggestions = [
    "Settle Total Position",
    "View Contract Hash",
    "Deferred Liquidity Request",
    "Direct Human Link"
  ];

  useEffect(() => {
    if (!activeCase) return;
    if (activeCase.loanId !== lastLoanId.current) {
      setMessages([{
        id: 'init',
        role: 'SYSTEM',
        text: `SYNKRON_V6 LINK ESTABLISHED // CASE: ${activeCase.loanId.toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString()
      }, {
        id: 'welcome',
        role: 'AI_AGENT',
        text: `Welcome, ${activeCase.applicantName.split(' ')[0]}. I am your Aegis Strategic Advisor. Analyzing your current position on Case ${activeCase.loanId}... How shall we optimize your liquidity today?`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      historyRef.current = [];
      setPendingAttachment(null);
      lastLoanId.current = activeCase.loanId;
    }
  }, [activeCase?.loanId, activeCase?.applicantName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setPendingAttachment({ mimeType: file.type, data: base64, fileName: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToUse = customText || inputText;
    if (!textToUse.trim() && !pendingAttachment) return;
    if (!activeCase) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'USER',
      text: textToUse,
      attachment: pendingAttachment || undefined,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = textToUse;
    const currentAttachment = pendingAttachment;
    
    setInputText('');
    setPendingAttachment(null);
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [];
      
      if (currentInput) parts.push({ text: currentInput });
      if (currentAttachment) {
        parts.push({ 
          inlineData: { data: currentAttachment.data, mimeType: currentAttachment.mimeType } 
        });
        if (!currentInput) parts.push({ text: "Forensic Analysis Requested on attached artifact." });
      }
      
      historyRef.current.push({ role: 'user', parts });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: historyRef.current,
        config: {
          systemInstruction: `You are the Elite Strategic Financial Advisor for Project Aegis. 
          Your tone: Sovereign, Precise, Institutional, and Highly Intelligent. 
          Current context: ${activeCase.applicantName} // ID: ${activeCase.loanId}.
          MULTILINGUAL CORE: Fluently adapt to any language requested by the user.
          OBJECTIVE: Guide the client toward settlement while maintaining high-trust institutional stability.`,
          temperature: 0.8,
        }
      });

      const textResponse = response.text || "Protocol acknowledgement confirmed. Proceed with next instruction.";
      
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'AI_AGENT',
        text: textResponse,
        timestamp: new Date().toLocaleTimeString()
      }]);
      historyRef.current.push({ role: 'model', parts: [{ text: textResponse }] });

    } catch (error) { 
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'SYSTEM',
        text: 'CORTEX_INTERRUPT: SYNC FAILURE. RE-ESTABLISHING LINK...',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally { setIsThinking(false); }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950/80 border border-white/5 rounded-[4rem] md:rounded-[5.5rem] overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative group">
      
      {/* HUD HEADER - Precise and high density */}
      <div className="shrink-0 p-8 md:p-10 border-b border-white/10 bg-white/[0.03] flex justify-between items-center z-10 backdrop-blur-3xl">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center shadow-xl shadow-cyan-900/10 group-hover:scale-105 transition-transform">
             <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(34,211,238,0.5)]"></div>
          </div>
          <div className="grid gap-0.5">
            <span className="text-[12px] font-black text-white uppercase tracking-[0.4em] font-mono leading-none">Neural_Advisor_6.4</span>
            <span className="text-[9px] font-mono text-cyan-500/60 uppercase font-black tracking-widest">Secure_Session // {activeCase?.loanId}</span>
          </div>
        </div>
        
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all border border-white/5 hover:text-cyan-400 hover:scale-110 active:scale-90"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        </button>
      </div>

      {/* CHAT VIEWPORT - Fluid message spacing */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 flex flex-col gap-10 no-scrollbar bg-[radial-gradient(circle_at_bottom_left,_rgba(6,182,212,0.04)_0%,_transparent_50%)] scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-4 ${msg.role === 'AI_AGENT' ? 'items-start max-w-[90%]' : msg.role === 'USER' ? 'items-end ml-auto max-w-[90%]' : 'items-center w-full'}`}>
            
            {msg.role === 'SYSTEM' ? (
              <div className="w-full flex items-center gap-6 opacity-30 select-none">
                 <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.8em] italic font-mono">{msg.text}</span>
                 <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
              </div>
            ) : (
              <div className={`group relative flex flex-col gap-3 ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                <div className="px-4 flex items-center gap-3">
                  <span className={`text-[9px] font-black uppercase tracking-[0.4em] font-mono ${msg.role === 'AI_AGENT' ? 'text-cyan-500' : 'text-slate-500'}`}>
                    {msg.role === 'AI_AGENT' ? 'Aegis_V6' : 'Nexus_Client'}
                  </span>
                </div>
                
                <div className={`p-6 md:p-8 rounded-[2.5rem] text-sm md:text-base leading-relaxed shadow-2xl transition-all border border-white/5 ${
                  msg.role === 'AI_AGENT' 
                  ? 'bg-slate-900/90 text-slate-200' 
                  : 'bg-gradient-to-br from-cyan-600 to-cyan-700 border-cyan-400 text-white font-medium italic'
                }`}>
                  <div className="whitespace-pre-wrap selection:bg-white selection:text-black">{msg.text}</div>
                  
                  {msg.attachment && (
                    <div className="mt-6 p-3 bg-black/40 rounded-3xl border border-white/10 overflow-hidden shadow-inner">
                      {msg.attachment.mimeType.startsWith('image/') ? (
                        <img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} className="max-w-sm rounded-2xl shadow-2xl hover:scale-105 transition-transform cursor-zoom-in" alt="Artifact" />
                      ) : (
                        <div className="p-6 flex items-center gap-5">
                           <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 font-black italic">PDF</div>
                           <span className="text-[11px] text-white/40 font-mono truncate max-w-[150px]">{msg.attachment.fileName}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[8px] font-mono text-slate-800 uppercase tracking-widest font-black opacity-0 group-hover:opacity-100 transition-opacity translate-y-1">{msg.timestamp} // HASH_V4</span>
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.03] rounded-full border border-white/10 self-start animate-pulse shadow-xl">
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-300"></div>
            </div>
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] font-mono italic">Syncing_Neural_Mesh...</span>
          </div>
        )}
      </div>

      {/* INPUT AREA - Matrix inspired dock */}
      <footer className="shrink-0 p-8 md:p-12 bg-black/80 border-t border-white/10 backdrop-blur-3xl relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        
        {/* Rapid Suggestions - Improved mobile swipe */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
           {suggestions.map((s, i) => (
             <button 
              key={i} onClick={() => handleSendMessage(undefined, s)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/10 hover:border-cyan-500/50 transition-all whitespace-nowrap active:scale-90"
             >
               {s}
             </button>
           ))}
        </div>

        {/* Attachment Pending Strip */}
        {pendingAttachment && (
          <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
             <div className="inline-flex items-center gap-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-[2rem] pr-6 group shadow-lg">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl">
                    {pendingAttachment.mimeType.startsWith('image/') ? (
                      <img src={`data:${pendingAttachment.mimeType};base64,${pendingAttachment.data}`} className="w-full h-full object-cover" alt="Artifact" />
                    ) : (
                      <div className="w-full h-full bg-cyan-900/40 flex items-center justify-center text-cyan-400 font-black text-xs">FILE</div>
                    )}
                </div>
                <div className="grid">
                   <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] leading-none mb-2">Artifact_Staged</span>
                   <span className="text-[9px] text-slate-600 font-mono truncate max-w-[150px] font-bold">{pendingAttachment.fileName}</span>
                </div>
                <button 
                  onClick={() => setPendingAttachment(null)}
                  className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xl shadow-2xl hover:scale-110 active:scale-90 ml-2"
                >
                  ×
                </button>
             </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="relative">
          <input 
            type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
            placeholder="Input tactical command or strategic inquiry..."
            className="w-full bg-slate-900/60 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] py-7 pl-10 pr-32 text-sm md:text-base font-mono text-white placeholder:text-slate-800 focus:outline-none focus:border-cyan-500/40 transition-all shadow-inner"
          />
          <button 
            type="submit" disabled={(!inputText.trim() && !pendingAttachment) || isThinking}
            className={`absolute right-3 top-3 bottom-3 px-10 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[10px] md:text-[11px] transition-all ${
              (inputText.trim() || pendingAttachment) && !isThinking
              ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95'
              : 'bg-slate-800 text-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            EXEC
          </button>
        </form>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
        
        <div className="mt-6 flex justify-center select-none">
           <span className="text-[8px] font-mono text-slate-800 uppercase tracking-[1em] font-black opacity-40">Aegis_Secured_Link // 4096_Bit_Handshake</span>
        </div>
      </footer>
    </div>
  );
};

export default NeuralNegotiator;
