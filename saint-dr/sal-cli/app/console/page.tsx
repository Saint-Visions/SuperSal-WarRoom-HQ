"use client";
import { useEffect, useState } from "react";

export default function ConsolePage() {
  const [systemPrompt, setSystemPrompt] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/agent")
      .then((res) => res.json())
      .then((data) => {
        setSystemPrompt(data.systemPrompt);
        console.log("🧠 Supersal loaded.");
      })
      .catch((err) => {
        console.error("Failed to load agent persona:", err);
      });
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Supersal™ Console</h1>
      <p className="text-muted mb-4">Persona: {systemPrompt || "Loading..."}</p>
      {/* Chat UI or dual bot interface would go here */}
    </main>
  );
}
