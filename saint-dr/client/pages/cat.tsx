"use client";

import { useEffect, useState } from "react";

export default function Cat() {
  const [structure, setStructure] = useState<string>("");

  useEffect(() => {
    const lines = [
      "📁 client/",
      "├── pages/",
      "│   ├── dashboard.tsx",
      "│   ├── crm.tsx",
      "│   ├── launchpad.tsx",
      "│   └── login.tsx",
      "├── components/ui/",
      "│   ├── Button.tsx",
      "│   └── Header.tsx",
      "├── hooks/",
      "│   └── useSession.ts",
      "├── lib/",
      "│   └── supabase.ts",
      "├── App.tsx",
      "└── global.css",
      "",
      "📁 server/",
      "├── routes/",
      "│   ├── auth.ts",
      "│   └── leads.ts",
      "├── lib/",
      "│   └── verify.ts",
      "└── index.ts",
      "",
      "📁 api/",
      "└── index.js",
      "",
      "📁 shared/",
      "└── api.ts",
    ];
    setStructure(lines.join(\"\\n\"));
  }, []);

  return (
    <div className=\"whitespace-pre font-mono p-6 text-sm text-white bg-black rounded-xl shadow-lg\">
      <h2 className=\"text-gold text-lg mb-2 font-bold\">SaintSal Project Tree</h2>
      {structure}
    </div>
  );
}
