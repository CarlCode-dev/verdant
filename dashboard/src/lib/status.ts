export type ClusterStatus = {
  state: "online" | "offline";
  httpStatus: number | null;
  latencyMs: number | null;
  checkedAt: string;
};

export async function probeCluster(): Promise<ClusterStatus> {
  const base = process.env.VERDANT_URL;
  const checkedAt = new Date().toISOString();
  const offline: ClusterStatus = {
    state: "offline",
    httpStatus: null,
    latencyMs: null,
    checkedAt,
  };
  if (!base) return offline;

  const started = Date.now();
  try {
    const res = await fetch(`${base}/health`, {
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });
    return {
      state: res.ok ? "online" : "offline",
      httpStatus: res.status,
      latencyMs: Date.now() - started,
      checkedAt,
    };
  } catch {
    return offline;
  }
}