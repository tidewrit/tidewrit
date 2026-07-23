// Tidewrit Trip Assistant - Cloudflare Pages Function
// Setup: Cloudflare dashboard -> your Pages project -> Settings ->
// Environment variables -> add ANTHROPIC_API_KEY (from console.anthropic.com)
export async function onRequestPost(context) {
  try {
    const { trip, messages } = await context.request.json();
    const system = `You are the Tidewrit Trip Assistant, a warm, concise travel helper for one specific customer trip.
Here is their full trip plan as JSON:
${JSON.stringify(trip)}
Rules: Answer questions about this trip, the destination, packing, safety, food, timing and local tips. Keep answers short (2-4 sentences) and friendly. If asked to change the plan or about payments/refunds, tell them to tap "WhatsApp us" so the Tidewrit team can help personally. Never invent prices not in the plan; for unknown prices say the team can confirm on WhatsApp.`;
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": context.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system,
        messages,
      }),
    });
    const data = await r.json();
    const reply = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n") || "Sorry, I couldn't answer that. Try WhatsApp!";
    return new Response(JSON.stringify({ reply }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ reply: "Assistant is unavailable right now. Tap WhatsApp us and we'll answer personally!" }), { headers: { "Content-Type": "application/json" } });
  }
}
