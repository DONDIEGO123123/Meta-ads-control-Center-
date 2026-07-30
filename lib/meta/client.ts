const BASE = "https://graph.facebook.com";
const VERSION = process.env.META_API_VERSION || "v25.0";
const TOKEN = process.env.META_ACCESS_TOKEN!;

type Params = Record<string, string | number | undefined>;
type MetaPage<T> = { data?: T[]; paging?: { next?: string }; error?: { message: string } };

export async function metaGetAll<T = any>(path: string, params: Params = {}): Promise<T[]> {
  const url = new URL(`${BASE}/${VERSION}/${path}`);
  url.searchParams.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }
  const rows: T[] = [];
  let next: string | undefined = url.toString();
  while (next) {
    const res: Response = await fetch(next);
    const json: MetaPage<T> = await res.json();
    if (json.error) throw new Error(json.error.message);
    rows.push(...(json.data ?? []));
    next = json.paging?.next;
  }
  return rows;
}

export async function metaPost(path: string, params: Params = {}): Promise<any> {
  const form = new URLSearchParams();
  form.set("access_token", TOKEN);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) form.set(k, String(v));
  }
  const res = await fetch(`${BASE}/${VERSION}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error?.message || `Meta API error ${res.status}`);
  return json;
}
