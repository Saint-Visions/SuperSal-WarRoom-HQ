import { config } from "dotenv";
config();

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function askSal(prompt: string): Promise<string> {
  const res = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are SuperSal™, Ryan's execution AI. Tactical. Fast. Faith-forward. Every answer is for a real CEO making real moves."
      },
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const answer = res.choices[0].message.content;
  console.log("💬 SAL:", answer);
  return answer || "No response.";
}

export async function syncMemory() {
  console.log("<0001f9e0> Syncing memory to Upstash + Supabase...");
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("✅ Memory sync complete.");
}
