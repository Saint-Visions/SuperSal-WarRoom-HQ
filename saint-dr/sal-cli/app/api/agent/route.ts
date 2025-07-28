import { loadPersona } from "../../../lib/supersal/loadPersona";

export async function GET(req: Request) {
  const user = { role: "admin", id: "ryan" }; // dynamic if needed
  const persona = await loadPersona(user);
  return new Response(JSON.stringify(persona), { status: 200 });
}
