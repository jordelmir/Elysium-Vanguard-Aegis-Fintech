
import React, { useState, useEffect, useRef } from 'react';
import { CollectionCase } from '../types';
import { GoogleGenAI, Modality, LiveServerMessage, Type, FunctionDeclaration } from '@google/genai';
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
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState<Attachment | null>(null);
  const [showQuickAction, setShowQuickAction] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const historyRef = useRef<any[]>([]);

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const registerPaymentFunction: FunctionDeclaration = {
    name: 'register_payment_agreement',
    parameters: {
      type: Type.OBJECT,
      description: 'Registra visualmente un pago confirmado en el Ledger del sistema.',
      properties: {
        amount: { type: Type.NUMBER },
        referenceId: { type: Type.STRING },
        agreementType: { type: Type.STRING, description: 'FULL_PAYMENT o PARTIAL' }
      },
      required: ['amount', 'agreementType']
    }
  };

  useEffect(() => {
    if (!activeCase) return;
    setMessages([{
      id: 'init',
      role: 'SYSTEM',
      text: `CANAL DE NEGOCIACIÓN ABIERTO CON ${activeCase.applicantName}`,
      timestamp: new Date().toLocaleTimeString()
    }]);
    historyRef.current = [];
    setPendingAttachment(null);
    setShowQuickAction(null);
  }, [activeCase]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
      id: Date.now().toString(),
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
      const parts: any[] = [{ text: currentInput || "Analiza el archivo adjunto." }];
      if (currentAttachment) parts.push({ inlineData: { data: currentAttachment.data, mimeType: currentAttachment.mimeType } });
      
      historyRef.current.push({ role: 'user', parts });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: historyRef.current,
        config: {
          systemInstruction: `Eres Aegis AI V6. Negociador experto. 
          1. Obligatorio: si mencionan pago, pide comprobante. 
          2. Si envían comprobante y es válido, usa register_payment_agreement. 
          3. Sé ejecutivo y profesional.`,
          tools: [{ functionDeclarations: [registerPaymentFunction] }]
        }
      });

      const textResponse = response.text || "";

      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'register_payment_agreement') {
            bioSocket.updateCase(activeCase.loanId, { 
              recoveryProbability: 1, 
              lastInteraction: `SETTLED: $${fc.args.amount}` 
            });
            setMessages(prev => [...prev, {
              id: `sys-${Date.now()}`,
              role: 'SYSTEM',
              text: `TRANSACCIÓN CERTIFICADA`,
              metadata: fc.args,
              timestamp: new Date().toLocaleTimeString()
            }]);
          }
        }
      }

      if (textResponse) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'AI_AGENT',
          text: textResponse,
          timestamp: new Date().toLocaleTimeString()
        }]);
        historyRef.current.push({ role: 'model', parts: [{ text: textResponse }] });
        
        // Detección inteligente de acciones rápidas
        if (textResponse.toLowerCase().includes('comprobante') || textResponse.toLowerCase().includes('recibo')) {
          setShowQuickAction('UPLOAD_RECEIPT');
        } else {
          setShowQuickAction(null);
        }
      }
    } catch (error) { console.error(error); } finally { setIsThinking(false); }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950/80 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
      
      {/* HUD HEADER */}
      <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
             <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_10px_cyan]"></div>
          </div>
          <div className="grid">
            <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Aegis_Cortex_V6.0</span>
            <span className="text-[8px] font-mono text-slate-500 uppercase">Encrypted_Uplink_Active</span>
          </div>
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-all border border-white/5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
        </button>
      </div>

      {/* CHAT VIEWPORT */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 no-scrollbar bg-[radial-gradient(circle_at_top_right,_rgba(0,242,255,0.02)_0%,_transparent_50%)]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col gap-2 ${msg.role === 'AI_AGENT' ? 'items-start max-w-[85%]' : msg.role === 'USER' ? 'items-end ml-auto max-w-[85%]' : 'items-center w-full'}`}>
            
            {msg.role === 'SYSTEM' && msg.metadata ? (
               <div className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 animate-in zoom-in-95">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-emerald-500 font-black text-[9px] tracking-widest uppercase">Certified_Receipt</span>
                    <span className="text-[8px] font-mono text-slate-500">#{msg.metadata.referenceId || 'TXN-8822'}</span>
                  </div>
                  <div className="text-2xl font-black text-white mb-2">$ {msg.metadata.amount}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-tighter">Agreement: {msg.metadata.agreementType}</div>
                  <div className="mt-4 pt-4 border-t border-emerald-500/20 text-[8px] text-emerald-500/60 font-mono italic">Block_Hash: SHA256_VERIFIED_BY_AEGIS</div>
               </div>
            ) : (
              <>
                <div className="px-1 flex items-center gap-2">
                  <span className={`text-[7px] font-black uppercase tracking-widest ${msg.role === 'AI_AGENT' ? 'text-cyan-500' : 'text-slate-500'}`}>{msg.role}</span>
                  <span className="text-[6px] text-slate-800">{msg.timestamp}</span>
                </div>
                <div className={`p-4 rounded-3xl text-[11px] font-mono leading-relaxed border transition-all ${msg.role === 'AI_AGENT' ? 'bg-slate-900 border-white/5 text-slate-300' : msg.role === 'USER' ? 'bg-cyan-600 border-cyan-400 text-white shadow-xl' : 'bg-transparent border-white/5 text-slate-600 text-center uppercase tracking-widest text-[8px] py-1 w-full italic'}`}>
                  {msg.text}
                  {msg.attachment && (
                    <div className="mt-4 p-3 bg-black/50 rounded-2xl border border-white/10 flex items-center gap-4">
                      {msg.attachment.mimeType.startsWith('image/') ? (
                        <img src={`data:${msg.attachment.mimeType};base64,${msg.attachment.data}`} className="w-14 h-14 object-cover rounded-xl border border-white/20" alt="" />
                      ) : (
                        <div className="w-14 h-14 bg-red-950/20 rounded-xl flex items-center justify-center border border-red-500/30"><span className="text-[10px] font-black text-red-500">PDF</span></div>
                      )}
                      <div className="grid">
                        <span className="text-[9px] font-black text-white truncate max-w-[150px]">{msg.attachment.fileName}</span>
                        <span className="text-[7px] opacity-40">{msg.attachment.mimeType}</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
        {isThinking && <div className="text-cyan-500/40 text-[9px] font-black uppercase animate-pulse tracking-widest px-2">Cortex_Syncing...</div>}
      </div>

      {/* INTERACTIVE INPUT ZONE */}
      <footer className="p-6 bg-black/40 border-t border-white/5 flex flex-col gap-4">
        
        {/* QUICK ACTIONS BAR */}
        <div className="flex gap-2 h-8">
           {showQuickAction === 'UPLOAD_RECEIPT' && (
             <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-0 h-full bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-[8px] font-black uppercase tracking-widest hover:bg-cyan-500/20 transition-all flex items-center gap-2 animate-in slide-in-from-left-4"
             >
               <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
               UPLOAD_PAYMENT_RECEIPT
             </button>
           )}
           {activeCase?.daysPastDue && activeCase.daysPastDue > 30 && (
             <button 
              onClick={() => handleSendMessage(undefined, "Solicito plan de pagos flexible")}
              className="px-4 py-0 h-full bg-slate-800 rounded-full text-slate-400 text-[8px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center"
             >
               REQUEST_PAYMENT_PLAN
             </button>
           )}
        </div>

        {pendingAttachment && (
          <div className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl animate-in slide-in-from-bottom-2">
            <span className="text-[9px] font-black text-white truncate max-w-[200px]">{pendingAttachment.fileName}</span>
            <button onClick={() => setPendingAttachment(null)} className="text-red-500 p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="relative">
          <input 
            type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
            placeholder="Type negotiation command..." disabled={!activeCase}
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-6 pr-20 text-[11px] font-mono text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/50"
          />
          <button 
            type="submit" disabled={(!inputText.trim() && !pendingAttachment) || isThinking || !activeCase}
            className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)]"
          >
            EXEC
          </button>
        </form>
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,application/pdf" />
      </footer>
    </div>
  );
};

export default NeuralNegotiator;
