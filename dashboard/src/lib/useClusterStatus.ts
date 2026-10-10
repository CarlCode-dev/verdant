"use client";

import { useEffect, useState } from "react";
import type { ClusterStatus } from "./status";

export function useClusterStatus(intervalMs = 30000) {
  const [status, setStatus] = useState<ClusterStatus | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        const data: ClusterStatus = await res.json();
        if (alive) setStatus(data);
      } catch {
        if (alive) {
          setStatus({
            state: "offline",
            httpStatus: null,
            latencyMs: null,
            checkedAt: new Date().toISOString(),
          });
        }
      }
    };
    load();
    const id = setInterval(load, intervalMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [intervalMs]);

  return status;
}