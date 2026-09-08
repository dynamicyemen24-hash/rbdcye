/**
 * Cloudflare Pages Function — Turnstile server-side verification
 * The secret key stays server-side only (never exposed to the browser).
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  const CORS_HEADERS = {
    "Access-Control-Allow-Origin": env.CORS_ORIGIN || "https://rbdcye.org",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "Token required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const secret = env.CLOUDFLARE_TURNSTILE_SECRET;
    if (!secret) {
      console.error("[Turnstile] CLOUDFLARE_TURNSTILE_SECRET not configured");
      return new Response(JSON.stringify({ success: false, error: "Server misconfigured" }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const verifyResponse = await fetch("https://challenges.cloudflare.com/v1/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
    });

    const result = await verifyResponse.json();

    return new Response(JSON.stringify({ success: result.success }), {
      status: result.success ? 200 : 403,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Turnstile] Verification error:", err.message);
    return new Response(JSON.stringify({ success: false, error: "Verification failed" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
}
