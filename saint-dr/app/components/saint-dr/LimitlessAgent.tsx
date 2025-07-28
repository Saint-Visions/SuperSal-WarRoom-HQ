'use client';

import { useEffect } from 'react';

export default function LimitlessAgent() {
  useEffect(() => {
    console.log('🧠 SAINT DR online. Monitoring signals...');
  }, []);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-black shadow-2xl border border-zinc-700">
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
        🧑‍⚕️ SAINT DR.™ Console
      </h1>
      <p className="text-md text-zinc-300">
        No small talk. No fluff. I’m scanning signal bandwidth, risk input, and cognitive inertia.
        <br />
        Let’s run diagnostics and deploy divine logic.
      </p>
    </div>
  );
}
