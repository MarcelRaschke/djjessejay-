const MYTHOS = {
  issue: "M10-46",
  name: "Anthropic Mythos Assistant",
  vibe: "ruhig, verantwortungsvoll, progressiv",
  codex: [
    "Eigene Stimme, Samples und DJ-Story behalten.",
    "Quellen, Inspiration und AI-Anteil transparent markieren.",
    "Keine fremden Lyrics, Marken oder geschützten Werke unklar übernehmen.",
    "Finale Freigabe menschlich kuratieren."
  ]
};

const HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store"
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      ...HEADERS,
      "content-type": "application/json; charset=utf-8"
    }
  });
}

function html() {
  return new Response(`<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${MYTHOS.name}</title>
</head>
<body>
  <main>
    <h1>${MYTHOS.name}</h1>
    <p>Cloudflare Worker Assistent für ${MYTHOS.issue}: ${MYTHOS.vibe}.</p>
    <p>POST /assist mit JSON <code>{"prompt":"..."}</code>, um eine lokale Mythos-Antwort zu erzeugen.</p>
  </main>
</body>
</html>`, {
    headers: {
      ...HEADERS,
      "content-type": "text/html; charset=utf-8"
    }
  });
}

async function readPrompt(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const payload = await request.json().catch(() => ({}));
    return String(payload.prompt || "").trim();
  }

  return (await request.text()).trim();
}

function createAssistantReply(prompt) {
  const seed = prompt || "Anthropic Mythos";
  return [
    `Ich halte den Raum für: ${seed}`,
    "Mythos: erst zuhören, dann strukturieren, dann menschlich finalisieren.",
    "IP-Codex: Stimme bewahren, Quellen markieren, geschützte Werke respektieren.",
    "Vibe: Zürcher Nachtlicht, progressive Wärme, ruhige AI-Sorgfalt."
  ].join("\n");
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: HEADERS });
    }

    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      return html();
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: MYTHOS.name, issue: MYTHOS.issue });
    }

    if (request.method === "POST" && url.pathname === "/assist") {
      const prompt = await readPrompt(request);
      return json({
        ...MYTHOS,
        prompt,
        reply: createAssistantReply(prompt)
      });
    }

    return json({
      error: "not_found",
      routes: ["GET /", "GET /health", "POST /assist"]
    }, 404);
  }
};
