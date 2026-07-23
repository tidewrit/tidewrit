// Returns a trip's encrypted blob from Cloudflare KV.
// One-time setup (no code): Cloudflare dashboard -> Workers & Pages -> KV ->
// Create namespace "TRIPS". Then Pages project -> Settings -> Functions ->
// KV namespace bindings -> Variable name: TRIPS -> select the namespace.
// Per customer: KV -> your namespace -> Add entry:
//   key:   trip:maya-zanzibar        (the id in the customer's link)
//   value: the encrypted blob from the generator
export async function onRequestGet(context) {
  const id = new URL(context.request.url).searchParams.get("id") || "";
  if (!id || !context.env.TRIPS) return json({ blob: null });
  const blob = await context.env.TRIPS.get("trip:" + id.toLowerCase());
  return json({ blob });
}
function json(o){ return new Response(JSON.stringify(o), { headers: { "Content-Type": "application/json" } }); }
