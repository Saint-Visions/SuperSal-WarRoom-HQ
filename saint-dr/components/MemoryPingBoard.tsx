"use client";
import React, { useState } from "react";

export default function MemoryPingBoard() {
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const submitNote = () => {
    if (input.trim()) {
      const newNote = `${new Date().toLocaleString()} → ${input}`;
      setNotes([newNote, ...notes]);
      setInput("");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">🧠 Memory Pings</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add internal note or ping"
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
        <button
          onClick={submitNote}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map((note, i) => (
          <li key={i} className="bg-gray-100 p-2 rounded shadow-sm text-sm">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}
