
import React, { useState, useEffect, useRef } from 'react';
import { CollectionCase } from '../types';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { bioSocket } from '../services/mockSocketService';

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

  // Intelligent suggestions in English
  const suggestions = [
    "How can I settle today?",
    "View signed contract",
    "Request 15-day extension",
    "Speak with a human"
  ];

  useEffect(() => {
    if (!activeCase) return;
    if (activeCase.loanId !== lastLoanId.current) {
      setMessages([{
        id: 'init',
        role: 'SYSTEM',
        text: `ELITE ADVISORY PROTOCOL ACTIVATED FOR ${activeCase.applicantName.toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString()
      }, {
        id: 'welcome',
        role: 'AI_AGENT',
        text: `Welcome, Mr./Ms. ${activeCase.applicantName.split(' ')[0]}. I am your Aegis V6 Advisor. I have analyzed your file ${activeCase.loanId}. Which vector of your financial health would you like to explore today?`,
        timestamp: new Date().toLocaleTimeString()
      }]);
      historyRef.current = [];
      setPendingAttachment(null);
      lastLoanId.current = activeCase.loanId;
    }
  }, [activeCase?.loanId]);

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
          inlineData: { 
            data: currentAttachment.data, 
            mimeType: currentAttachment.mimeType 
          } 
        });
        if (!currentInput) parts.push({ text: "Analyze this attached documentation." });
      }
      
      historyRef.current.push({ role: 'user', parts });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: historyRef.current,
        config: {
          systemInstruction: `You are the Elite Financial Advisor for Project Aegis. 
          Your tone is: Sophisticated, Executive, Empowering, and Decisive. 
          Current user: ${activeCase.applicantName}. Credit ID: ${activeCase.loanId}.
          MULTILINGUAL CAPABILITY: While the interface is in English, you must respond fluently in the user's language if they switch (e.g., Spanish, French, etc.).
          RULES:
          1. If they send a proof (image), confirm it with professional enthusiasm.
          2. Use Markdown for structure (Bold for amounts, lists for options).
          3. If they ask for a new loan, explain that the current one must be in 'Excellent Standing'.
          4. Never say "I'm sorry", say "Analyzing alternatives" or "Finding the best route".`,
          temperature: 0.7,
        }
      });

      const textResponse = response.text || "I have processed the information. How would you like to proceed?";
      
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: 'AI_AGENT',
        text: textResponse,
        timestamp: new Date().toLocaleTimeString()
      }]);
      historyRef.current.push({ role: 'model', parts: [{ text: textResponse }] });

    } catch (error) { 
      console.error(error); 
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'SYSTEM',
        text: 'CORTEX SYNC FAILURE. RETRYING...',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally { setIsThinking(false); }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/90 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
      
      {/* HUD HEADER */}
      <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-lg">
             <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_15px_cyan]"></div>
          </div>
          <div className="grid">
            <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Neural_Advisor_V6</span>
            <span className="text-[8px] font-mono text-cyan-500/60 uppercase">High_Priority_Session // {activeCase?.loanId}</span>
          </div>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => fileInputRef.current?.click()} 
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all border border-white/5 group"
           >
             <svg className="w-5 h-5 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
           </button>
        </div>
      </div>

      {/* CHAT VIEWPORT */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-8 no-scrollbar bg-[radial-gradient(circle_at_bottom_left,_rgba(6,182,212,0.03)_0%,_transparent_40%)]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-3 ${msg.role === 'AI_AGENT' ? 'items-start max-w-[90%]' : msg.role === 'USER' ? 'items-end ml-auto max-w-[90%]' : 'items-center w-full'}`}>
            
            {msg.role === 'SYSTEM' ? (
              <div className="w-full flex items-center gap-4 opacity-50">
                 <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] italic">{msg.text}</span>
                 <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
              </div>
            ) : (
              <div className={`group relative flex flex-col gap-2 ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}>
                <div className={`px-2 flex items-center gap-2 mb-1`}>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${msg.role === 'AI_AGENT' ? 'text-cyan-500' : 'text-slate-400'}`}>
                    {msg.role === 'AI_AGENT' ? 'Aegis_Advisor' : 'Client_Node'}
                  </span>
                </div>
                
                <div className={`p-5 rounded-[2rem] text-[13px] leading-relaxed shadow-xl transition-all border ${
                  msg.role === 'AI_AGENT' 
                  ? 'bg-slate-900 border-white/5 text-slate-200' 
                  : 'bg-gradient-to-br from-cyan-600 to-cyan-700 border-cyan-400 text-white font-medium'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  
                  {msg.attachment && (
                    <div className="mt-4 p-2 bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
                      {msg.attachment.mimeType.startsWith('image/') ? (
                        <img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} className="max-w-xs rounded-xl shadow-2xl hover:scale-105 transition-transform cursor-zoom-in" alt="Attachment" />
                      ) : (
                        <div className="p-4 flex items-center gap-4">
                           <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500 font-bold">PDF</div>
                           <span className="text-[10px] text-white/60 font-mono truncate">{msg.attachment.fileName}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[8px] font-mono text-slate-700 mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase">{msg.timestamp}</span>
              </div>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 self-start animate-pulse">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-1 bg-cyan-500 rounded-full animate-bounce delay-150"></div>
            </div>
            <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">Syncing Cortex...</span>
          </div>
        )}
      </div>

      {/* INPUT AREA */}
      <footer className="p-6 md:p-8 bg-black/60 border-t border-white/5 backdrop-blur-xl relative z-10">
        
        {/* Dynamic Suggestions */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
           {suggestions.map((s, i) => (
             <button 
              key={i} onClick={() => handleSendMessage(undefined, s)}
              className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 hover:text-white hover:bg-white/10 hover:border-cyan-500/50 transition-all whitespace-nowrap"
             >
               {s}
             </button>
           ))}
        </div>

        {/* File Preview Bar */}
        {pendingAttachment && (
          <div className="mb-4 animate-in slide-in-from-bottom-4 duration-300">
             <div className="inline-flex items-center gap-3 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl pr-4 relative group">
                {pendingAttachment.mimeType.startsWith('image/') ? (
                  <img src={`data:${pendingAttachment.mimeType};base64,${pendingAttachment.data}`} className="w-12 h-12 object-cover rounded-xl border border-cyan-500/20" alt="Preview" />
                ) : (
                  <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-500 text-xs font-bold">FILE</div>
                )}
                <div className="grid">
                   <span className="text-[9px] font-black text-cyan-400 uppercase leading-none mb-1">Loading Attachment...</span>
                   <span className="text-[8px] text-slate-500 font-mono truncate max-w-[120px]">{pendingAttachment.fileName}</span>
                </div>
                <button 
                  onClick={() => setPendingAttachment(null)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs shadow-xl scale-0 group-hover:scale-100 transition-transform"
                >
                  ×
                </button>
             </div>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="relative group">
          <input 
            type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your negotiation command or inquiry..."
            className="w-full bg-slate-900/60 border border-white/10 rounded-[2rem] py-5 pl-8 pr-24 text-[13px] font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner"
          />
          <button 
            type="submit" disabled={(!inputText.trim() && !pendingAttachment) || isThinking}
            className={`absolute right-2 top-2 bottom-2 px-8 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all ${
              (inputText.trim() || pendingAttachment) && !isThinking
              ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            EXEC
          </button>
        </form>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
        
        <div className="mt-4 flex justify-center">
           <span className="text-[7px] font-mono text-slate-700 uppercase tracking-[0.6em]">Aegis_Secured_Neural_Link // End_To_End_Encrypted</span>
        </div>
      </footer>
    </div>
  );
};

export default NeuralNegotiator;
