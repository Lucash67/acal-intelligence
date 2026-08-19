import { NextResponse } from "next/server";
import { getRuntimeConfig } from "@/services/dashboard-data";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "acal-intelligence",
    ...getRuntimeConfig(),
  });
}
