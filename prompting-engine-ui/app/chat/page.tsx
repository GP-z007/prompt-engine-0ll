'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, connectionError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setConnectionError(false);

    const userMessage = { role: 'user', content: input };
    const newChatHistory = [...messages, userMessage];
    setMessages(newChatHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newChatHistory }), 
      });

      if (response.status === 503) {
        setConnectionError(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) throw new Error('Server error');
      
      const data = await response.json();
      setMessages([...newChatHistory, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("Fetch error:", error);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-sans">
      <header className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
        <Link href="/" className="px-4 py-2 bg-zinc-100 text-zinc-950 rounded-lg hover:bg-zinc-300 transition-colors text-sm font-semibold">
          Back →
        </Link>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${connectionError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
          <span className="text-xs text-zinc-400">{connectionError ? 'n8n Offline' : 'n8n Connected'}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full max-w-3xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
            <p>What kind of prompt do you need to build today?</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 leading-relaxed text-[15px] shadow-sm ${m.role === 'user' ? 'bg-zinc-800 text-zinc-100 rounded-br-sm' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-sm'}`}>
              {m.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-bl-sm px-5 py-4 flex gap-1.5 items-center">
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        {connectionError && (
          <div className="flex justify-start">
            <div className="bg-red-950/50 border border-red-900/50 text-red-400 rounded-2xl rounded-bl-sm px-5 py-4 text-[15px]">
              ⚠️ <strong>Connection Error:</strong> n8n server is not responding. Please check that your Docker container is running and the Webhook node is active.
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <div className="p-4 bg-zinc-950 border-t border-zinc-800 w-full">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask anything..."
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-xl px-5 py-4 pr-14 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent placeholder-zinc-500 transition-all disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
