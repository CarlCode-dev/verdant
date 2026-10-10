import { connection, NextResponse } from "next/server";
import { probeCluster } from "@/lib/status";

export async function GET() {
  await connection();
  return NextResponse.json(await probeCluster());
}