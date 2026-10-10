"use client";

import { useClusterStatus } from "@/lib/useClusterStatus";

export default function StatusPill() {
  const status = useClusterStatus();
  const online = status?.state === "online";
  const label = status === null ? "checking" : online ? "online" : "offline";

  return (
    <span className="flex items-center gap-1.5 rounded-full bg-sage/10 px-2.5 py-1 text-[11px]">
      <span
        className={`h-1.5 w-1.5 rounded-full ${online ? "bg-sage" : "bg-mint/40"}`}
      />
      {label}
    </span>
  );
}