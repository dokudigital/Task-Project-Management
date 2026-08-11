import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2 } from 'lucide-react';

interface AiAssistantModalProps {
  onClose: () => void;
  appName?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ onClose, appName = 'DOKU' }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Halo! Saya ${appName} AI Assistant. Saya bisa membantu merancang spesifikasi proyek, menyusun subtask, merangkum dokumen, atau memberikan rekomendasi manajemen tim.`
    }
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          prompt: userMsg
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: data.error || 'Terjadi kesalahan saat memanggil AI.' }]);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Gagal terhubung ke AI server.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full h-[600px] border border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-[#000000] to-[#161616] text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ea1d25] animate-pulse" />
            <div>
              <h2 className="text-sm font-extrabold text-white">DOKU AI Project Assistant</h2>
              <p className="text-[10px] text-slate-300">Gemini 3.6 Flash Server Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-[#ea1d25] text-white font-medium rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-2xs rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-[#ea1d25] font-bold flex items-center gap-2 shadow-2xs">
                <Loader2 className="w-4 h-4 animate-spin text-[#ea1d25]" />
                <span>Gemini AI sedang berpikir...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2 rounded-b-2xl">
          <input
            type="text"
            placeholder="Tanyakan sesuatu ke AI Gemini..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#ea1d25]"
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-[#ea1d25] hover:bg-[#c8141b] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim</span>
          </button>
        </form>
      </div>
    </div>
  );
};
