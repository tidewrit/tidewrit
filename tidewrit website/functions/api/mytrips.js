// "My Trips" lookup from Cloudflare KV.
// Per customer: KV -> Add entry:
//   key:   user:maya@email.com
//   value: [{"title":"Zanzibar Getaway","dates":"12 - 16 Oct 2026","url":"/plan.html?t=maya-zanzibar"}]
// For a second trip, edit the entry and add another {...} to the list.
export async function onRequestPost(context) {
  try {
    const { email } = await context.request.json();
    if (!context.env.TRIPS) return json({ trips: [] });
    const raw = await context.env.TRIPS.get("user:" + (email || "").trim().toLowerCase());
    return json({ trips: raw ? JSON.parse(raw) : [] });
  } catch { return json({ trips: [] }); }
}
function json(o){ return new Response(JSON.stringify(o), { headers: { "Content-Type": "application/json" } }); }
