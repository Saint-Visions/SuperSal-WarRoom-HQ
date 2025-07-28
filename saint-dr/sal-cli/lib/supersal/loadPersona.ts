import { getPersona } from "./personality";

export async function loadPersona(user?: { role?: string; id?: string }) {
  const role = user?.role || "guest";
  const userId = user?.id || undefined;
  const persona = getPersona({ role, userId });

  return {
    mode: persona.mode,
    systemPrompt: persona.prompt,
  };
}
