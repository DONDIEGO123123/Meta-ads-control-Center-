import { supabaseAdmin } from "@/lib/supabase/server";
import { setCampaignStatus, setCampaignBudget } from "@/lib/meta/actions";

function nextRun(from: string, repeat: string): string | null {
  const d = new Date(from);
  if (repeat === "daily") d.setDate(d.getDate() + 1);
  else if (repeat === "weekly") d.setDate(d.getDate() + 7);
  else if (repeat === "monthly") d.setMonth(d.getMonth() + 1);
  else return null;
  return d.toISOString();
}

export async function runScheduled() {
  const db = supabaseAdmin();
  const now = new Date().toISOString();

  const { data } = await db.from("scheduled_actions")
    .select("*")
    .eq("status", "pending")
    .lte("run_at", now)
    .order("run_at", { ascending: true })
    .limit(50);

  const due = (data ?? []) as any[];
  let executed = 0;
  const results: any[] = [];

  for (const a of due) {
    try {
      if (a.action === "pause") await setCampaignStatus(a.meta_campaign_id, "PAUSED");
      else if (a.action === "resume") await setCampaignStatus(a.meta_campaign_id, "ACTIVE");
      else if (a.action === "budget") await setCampaignBudget(a.meta_campaign_id, Number(a.value));
      else throw new Error("unknown action: " + a.action);

      await db.from("scheduled_actions").update({
        status: "done", result: "ok", executed_at: new Date().toISOString(),
      }).eq("id", a.id);

      const next = a.repeat ? nextRun(a.run_at, a.repeat) : null;
      if (next) {
        await db.from("scheduled_actions").insert({
          target_type: a.target_type ?? "campaign",
          meta_campaign_id: a.meta_campaign_id,
          campaign_name: a.campaign_name,
          action: a.action, value: a.value,
          run_at: next, repeat: a.repeat,
        });
      }

      executed++;
      results.push({ id: a.id, ok: true });
    } catch (e: any) {
      await db.from("scheduled_actions").update({
        status: "error", result: (e.message ?? "error").slice(0, 500),
        executed_at: new Date().toISOString(),
      }).eq("id", a.id);
      results.push({ id: a.id, ok: false, error: e.message });
    }
  }

  return { executed, due: due.length, results };
}
