import { loadPersona } from "@/lib/supersal/loadPersona";

export async function GET(req: Request) {
  const user = { role: "admin", id: "ryan" }; // dynamic if needed
  const { systemPrompt } = await loadPersona(user);
  return Response.json({ systemPrompt });
}
