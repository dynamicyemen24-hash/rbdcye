// RUM → Cloudflare Analytics Engine — INP p95 live
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const { name, value, rating, delta, id, navigationType } = body;
    // Basic validation
    if (!name || typeof value !== 'number') {
      return new Response(JSON.stringify({ ok: false }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    // Write to Analytics Engine if binding exists (env.ANALYTICS)
    // Dataset: web_vitals, blobs: [name, rating, navigationType, id], doubles: [value, delta]
    if (env && env.ANALYTICS && typeof env.ANALYTICS.writeDataPoint === 'function') {
      env.ANALYTICS.writeDataPoint({
        blobs: [String(name).slice(0,32), String(rating||'').slice(0,16), String(navigationType||'').slice(0,16), String(id||'').slice(0,64)],
        doubles: [Number(value), Number(delta||0)],
        indexes: [String(name).slice(0,32)]
      });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 202, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  }});
}
