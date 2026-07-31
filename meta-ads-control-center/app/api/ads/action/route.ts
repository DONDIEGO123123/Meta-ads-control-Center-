import { NextResponse } from "next/server";
import { setAdStatus } from "@/lib/meta/actions";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { action, adId } = await req.json();
    if (!adId) return NextResponse.json({ error: "missing adId" }, { status: 400 });
    if (action === "pause") await setAdStatus(adId, "PAUSED");
    else if (action === "resume") await setAdStatus(adId, "ACTIVE");
    else return NextResponse.json({ error: "unknown action" }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
