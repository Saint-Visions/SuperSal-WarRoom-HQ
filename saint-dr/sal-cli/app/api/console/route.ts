import { loadPersona } from "@/lib/supersal/loadPersona";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { prompt, user } = await req.json();

  const { systemPrompt } = await loadPersona(user);

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  return Response.json({
    result: res.choices[0].message.content,
  });
}
