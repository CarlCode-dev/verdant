"use client";

import { HeartPulse, Gauge, Activity, Clock } from "lucide-react";
import StatCard from "./StatCard";
import { useClusterStatus } from "@/lib/useClusterStatus";

export default function StatusCards() {
  const status = useClusterStatus();
  const online = status?.state === "online";
  const dash = "—";

  return (
    <section id="status" className="mx-auto w-full max-w-5xl px-7 py-2">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={HeartPulse}
          label="cluster status"
          value={status === null ? "checking" : online ? "running" : "offline"}
          good={online}
        />
        <StatCard
          icon={Gauge}
          label="response time"
          value={status?.latencyMs != null ? `${status.latencyMs} ms` : dash}
          good={online}
        />
        <StatCard
          icon={Activity}
          label="health check"
          value={status?.httpStatus != null ? `HTTP ${status.httpStatus}` : dash}
          good={online}
        />
        <StatCard
          icon={Clock}
          label="last checked"
          value={status ? new Date(status.checkedAt).toLocaleTimeString() : dash}
        />
      </div>
      <p className="mt-2 text-center text-[11px] text-mint/60">
        live /health check every 30s, shows offline while the VM is shut down to
        save cost
      </p>
    </section>
  );
}