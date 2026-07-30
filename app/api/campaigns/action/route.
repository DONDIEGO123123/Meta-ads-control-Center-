import { NextResponse } from "next/server";
import { setCampaignStatus, setCampaignBudget } from "@/lib/meta/actions";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { action, campaignId, value } = await req.json();
    if (!campaignId) return NextResponse.json({ error: "missing campaignId" }, { status: 400 });
    if (action === "pause") await setCampaignStatus(campaignId, "PAUSED");
    else if (action === "resume") await setCampaignStatus(campaignId, "ACTIVE");
    else if (action === "budget") await setCampaignBudget(campaignId, Number(value));
    else return NextResponse.json({ error: "unknown action" }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
