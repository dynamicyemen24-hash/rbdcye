/**
 * Cloudflare Pages Function — Turnstile server-side verification.
 * The secret key stays server-side only (never exposed to the browser).
 */

function allowedOrigins(env) {
  const configured = env?.CORS_ORIGIN;
  return (configured
    ? configured.split(',').map((origin) => origin.trim()).filter(Boolean)
    : ['https://rbdcye.org', 'https://www.rbdcye.org', 'https://rbdcye.pages.dev', 'http://localhost:5173', 'http://localhost:5174']);
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
  };
  if (origin && allowedOrigins(env).includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request, context.env),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = corsHeaders(request, env);

  try {
    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return jsonResponse({ success: false, error: 'Unsupported content type' }, 415, headers);
    }

    const body = await request.json();
    const token = typeof body?.token === 'string' ? body.token.trim() : '';
    if (!token || token.length > 4096) {
      return jsonResponse({ success: false, error: 'Invalid token' }, 400, headers);
    }

    const secret = env.CLOUDFLARE_TURNSTILE_SECRET;
    if (!secret) {
      console.error('[Turnstile] CLOUDFLARE_TURNSTILE_SECRET not configured');
      return jsonResponse({ success: false, error: 'Server misconfigured' }, 500, headers);
    }

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });

    if (!verifyResponse.ok) {
      console.error('[Turnstile] Siteverify returned a non-success HTTP status');
      return jsonResponse({ success: false, error: 'Verification service unavailable' }, 502, headers);
    }

    const result = await verifyResponse.json();
    return jsonResponse({ success: result?.success === true }, result?.success === true ? 200 : 403, headers);
  } catch (err) {
    console.error('[Turnstile] Verification error:', err instanceof Error ? err.message : 'Unknown error');
    return jsonResponse({ success: false, error: 'Verification failed' }, 500, headers);
  }
}

export default { onRequestPost, onRequestOptions };
