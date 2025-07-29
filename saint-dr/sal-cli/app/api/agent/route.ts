import { loadPersona } from "@/lib/supersal/loadPersona";

export async function GET(req: Request) {
  const user = { role: "admin", id: "ryan" }; // dynamic if needed
  const persona = await loadPersona(user.id); // pass string instead of object
  return new Response(JSON.stringify(persona), { status: 200 });
}
