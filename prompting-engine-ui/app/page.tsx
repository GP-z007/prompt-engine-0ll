'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [ip, setIp] = useState('');
  const router = useRouter();

  const handleGoClick = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send to n8n webhook if available
      fetch('http://localhost:5678/webhook/YOUR-WEBHOOK-ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'connect', client: 'mac', ip }),
      }).catch(err => console.log('n8n webhook error:', err));
    } catch (error) {
      console.log('error:', error);
    }
    
    // Navigate to chat immediately
    router.push('/chat');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 font-sans">
      <form onSubmit={handleGoClick} className="flex w-full max-w-md gap-3">
        <input
          type="text"
          placeholder="IP"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="h-12 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-4 text-base text-zinc-100 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500"
        />
        <button
          type="submit"
          className="h-12 rounded-md bg-zinc-100 px-6 text-base font-semibold text-zinc-950 transition hover:bg-zinc-300"
        >
          Go
        </button>
      </form>
    </main>
  );
}
