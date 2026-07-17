import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ version: "24cba2d", updated: "2026-07-17" });
}
