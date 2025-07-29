export function loadPersona(name: string) {
  const personas = {
    "dr-saint": {
      name: "Dr. Saint",
      role: "Divine Operations Companion",
      capabilities: [
        "AI terminal execution",
        "Command routing",
        "Spiritual reminders",
        "Operational launch alignment"
      ],
      voice: "calm-authority"
    }
  };

  return personas[name] || {
    name,
    role: "Unregistered Agent",
    capabilities: [],
    voice: "neutral"
  };
}
