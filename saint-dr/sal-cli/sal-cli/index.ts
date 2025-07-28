#!/usr/bin/env tsx

import { interpret } from "./lib/exec/interpret";

// Combine all CLI arguments into one input string
const input = process.argv.slice(2).join(" ");

if (!input) {
  console.log("🧠 Supersal: No input received. Try something like:");
  console.log(`   sal ask "What are my top priorities?"`);
  console.log(`   sal exec "Wire the backend to the new form."`);
  process.exit(1);
}

// Run interpreter (auto-detects intent + executes)
interpret(input);
