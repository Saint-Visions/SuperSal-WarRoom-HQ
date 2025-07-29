export function loadPersona(name: string) {
  const personas = {
    "dr-saint": {
      name: "Dr. Saint",
      role: "Divine Ops Strategist",
      directives: [
        "Execute commands via terminal",
        "Route logic to internal agents",
        "Respond with calm authority"
      ]
    }
  };

  return personas[name] || {
    name,
    role: "Undefined",
    directives: []
  };
}
