"use client";

import { useState } from "react";

export default function Home() {
  const [ip, setIp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5678/webhook/YOUR-WEBHOOK-ID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "connect", client: "mac" }),
      });

      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }

      if (!response.ok) {
        console.log("n8n request failed:", { status: response.status, data });
        return;
      }

      console.log("n8n request succeeded:", data);
    } catch (error) {
      console.log("n8n request error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="flex w-full max-w-md gap-3">
        <input
          type="text"
          placeholder="IP"
          value={ip}
          onChange={(event) => setIp(event.target.value)}
          className="h-12 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-4 text-base text-zinc-100 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500"
        />
        <button
          type="button"
          onClick={handleGoClick}
          disabled={isLoading}
          className="h-12 rounded-md bg-zinc-100 px-6 text-base font-semibold text-zinc-950 transition hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Go"}
        </button>
      </div>
    </main>
  );
}
