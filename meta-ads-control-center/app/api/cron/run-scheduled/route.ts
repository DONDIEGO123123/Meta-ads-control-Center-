import { NextResponse } from "next/server";
import { runScheduled } from "@/lib/scheduler/run";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const secret = new URL(req.url).searchParams.get("secret");
  const ok =
    (!!process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) ||
    (!!process.env.SYNC_SECRET && secret === process.env.SYNC_SECRET);
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const result = await runScheduled();
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
