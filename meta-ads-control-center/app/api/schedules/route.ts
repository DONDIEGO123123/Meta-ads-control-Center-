import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { metaCampaignId, campaignName, action, value, runAt, repeat } = await req.json();
    if (!metaCampaignId || !action || !runAt) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }
    const db = supabaseAdmin();
    const { error } = await db.from("scheduled_actions").insert({
      meta_campaign_id: metaCampaignId,
      campaign_name: campaignName ?? null,
      action,
      value: action === "budget" ? Number(value) : null,
      run_at: runAt,
      repeat: repeat ?? "none",
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await supabaseAdmin().from("scheduled_actions").delete().eq("id", id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
