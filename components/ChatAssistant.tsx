import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm DoodleBot. Hungry? Ask me what's good today! 🍔" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const responseText = await getChatResponse(userText, messages);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform z-40 flex items-center justify-center gap-2 font-doodle text-xl"
        >
          <Bot size={28} />
          <span className="hidden md:inline">Ask Chef</span>
        </button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-80 h-96 bg-white rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col z-50 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-primary p-3 border-b-2 border-black flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <Bot size={24} />
              <span className="font-doodle text-xl">DoodleBot</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-black">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-paper">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-xl border border-black text-sm font-sans ${
                    msg.role === 'user' 
                      ? 'bg-secondary text-black rounded-br-none' 
                      : 'bg-white text-black rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-xl rounded-bl-none border border-gray-300 text-xs italic">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-2 border-t-2 border-black bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about food..."
              className="flex-grow p-2 rounded-lg border border-gray-300 font-sans text-sm focus:outline-none focus:border-primary"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="bg-ink text-white p-2 rounded-lg hover:bg-gray-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
