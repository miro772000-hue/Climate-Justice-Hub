import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const result = await geminiService.askAboutClimate(userMessage.text, messages);
    
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: result.text, 
      groundingUrls: result.urls 
    }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] no-print">
      {isOpen ? (
        <div className="bg-white w-[350px] sm:w-[400px] h-[550px] rounded-[2rem] shadow-2xl flex flex-col border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8">
          <div className="bg-primary p-6 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/10">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="font-black text-sm">المساعد الذكي للعدالة المناخية</h3>
                <p className="text-[10px] text-white/70 font-bold uppercase">AI Smart Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="text-center py-8 px-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border border-primary/20">
                  <i className="fa-solid fa-robot animate-bounce"></i>
                </div>
                <h4 className="font-black text-accent mb-2">أهلاً بك في منصة د. مروى حسين</h4>
                <p className="text-xs text-gray-500 font-bold leading-relaxed">أنا مساعدك الذكي، جاهز للإجابة عن أي سؤال يخص موضوعات العدالة المناخية أو مساعدتك في استكشاف الخريطة.</p>
              </div>
            )}
            
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-2xl text-sm font-bold leading-relaxed shadow-sm whitespace-pre-line ${
                  m.role === 'user' 
                    ? 'bg-primary text-white rounded-bl-none' 
                    : 'bg-white text-accent border border-gray-100 rounded-br-none'
                }`}>
                  {m.text}
                  
                  {m.groundingUrls && m.groundingUrls.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-[10px] text-primary font-black mb-2 uppercase">مصادر خرائط جوجل:</p>
                      <div className="flex flex-col gap-2">
                        {m.groundingUrls.map((url, i) => (
                          <a 
                            key={i} 
                            href={url.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] text-blue-600 hover:underline flex items-center gap-2"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                            {url.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 rounded-br-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسألني عن أي شيء في المنهج..."
              className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none focus:bg-gray-50 transition-colors"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-50 shadow-md shadow-primary/20"
            >
              <i className="fa-solid fa-paper-plane-rtl"></i>
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all group relative border-4 border-white"
        >
          <i className="fa-solid fa-robot"></i>
          <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] font-black w-6 h-6 rounded-full border-2 border-white flex items-center justify-center animate-pulse shadow-lg">AI</span>
          <div className="absolute right-full mr-4 bg-accent text-white py-2 px-4 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl border border-white/10">
            المساعد الذكي
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;