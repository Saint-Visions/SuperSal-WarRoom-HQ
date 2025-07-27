import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useRealTimeData() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const queryClient = useQueryClient();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Periodic data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
        setLastSync(new Date());
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [isOnline, queryClient]);

  // Initial sync on mount
  useEffect(() => {
    if (isOnline) {
      setLastSync(new Date());
    }
  }, [isOnline]);

  return {
    isOnline,
    lastSync,
  };
}
