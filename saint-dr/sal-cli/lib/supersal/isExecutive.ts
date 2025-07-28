export function isExecutive(userId?: string): boolean {
  if (!userId) return false;

  const whitelist = [
    "ryan",
    "lalie",
    "ayden",
    "jr",
    "david",
    "jeff",
    "nader",
    "samer"
  ];

  return whitelist.includes(userId.toLowerCase());
}
