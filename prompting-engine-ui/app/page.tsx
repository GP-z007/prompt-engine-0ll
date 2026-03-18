"use client";

import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleIpClick = async () => {
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6">
      <button
        type="button"
        onClick={handleIpClick}
        disabled={isLoading}
        className="rounded-2xl bg-black px-12 py-6 text-3xl font-bold tracking-wide text-white shadow-xl transition hover:scale-105 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Loading..." : "IP"}
      </button>
    </main>
  );
}
