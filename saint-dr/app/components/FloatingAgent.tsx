'use client';
import { useState } from 'react';

export default function FloatingAgent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-black px-4 py-2 text-white shadow-xl hover:bg-gray-800"
      >
        💬 Saint~Dr.™
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 z-50 h-[600px] w-[400px] rounded-xl border bg-white shadow-xl">
          <iframe
            src="https://saintvisionai.com/saint-dr"
            className="h-full w-full rounded-xl"
            frameBorder="0"
          />
        </div>
      )}
    </>
  );
}
