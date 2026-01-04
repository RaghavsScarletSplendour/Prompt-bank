"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BetaGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkBetaAccess() {
      try {
        const response = await fetch("/api/beta/status");
        const data = await response.json();

        if (data.hasBetaAccess) {
          setHasAccess(true);
        } else {
          router.replace("/beta-access");
          return;
        }
      } catch (error) {
        console.error("Failed to check beta status:", error);
        // On error, redirect to beta-access as a safety measure
        router.replace("/beta-access");
        return;
      }
      setIsChecking(false);
    }

    checkBetaAccess();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
