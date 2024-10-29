"use client";

import { Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Private = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
      const apiKeyOnLS = localStorage.getItem("api-modal-state");
      apiKeyOnLS?.length && setApiKey(apiKeyOnLS || null);
    }
  }, []);

  return isClient ? (
    apiKey ? (
      <div>{children}</div>
    ) : null
  ) : (
    <div className="w-full h-screen flex items-center justify-center gap-4">
      <Sun className="w-4 h-4 animate-spin" /> Loading...
    </div>
  );
};

export default Private;
