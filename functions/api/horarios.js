// API de horarios guardados: GET lista, PUT ?id=… guarda, DELETE ?id=… elimina.
// Los datos viven en Cloudflare KV (binding HORARIOS), compartidos entre todos los dispositivos.
// Opcional: define la variable HORARIOS_CLAVE para pedir una clave al guardar o eliminar.
const ID_OK = /^[0-9]{4}-[1-3]__IAEV-PA-[0-9]{2}__(P|[1-9]|10)$/;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "content-type": "application/json", "cache-control": "no-store" } });

export async function onRequest({ request, env }) {
  const kv = env.HORARIOS;
  if (!kv) return new Response("Falta el KV HORARIOS", { status: 500 });
  const url = new URL(request.url);

  if (request.method === "GET") {
    const keys = [];
    let cursor;
    do {
      const page = await kv.list({ cursor });
      keys.push(...page.keys.map((k) => k.name));
      cursor = page.list_complete ? null : page.cursor;
    } while (cursor);
    const items = await Promise.all(keys.map((k) => kv.get(k, { type: "json" })));
    return json(items.filter(Boolean));
  }

  const clave = env.HORARIOS_CLAVE;
  if (clave && request.headers.get("x-clave") !== clave) return new Response("Clave incorrecta", { status: 401 });

  const id = url.searchParams.get("id") || "";
  if (!ID_OK.test(id)) return new Response("id no válido", { status: 400 });

  if (request.method === "PUT") {
    const text = await request.text();
    if (text.length > 200_000) return new Response("Horario demasiado grande", { status: 413 });
    let body;
    try { body = JSON.parse(text); } catch { return new Response("JSON no válido", { status: 400 }); }
    if (!body || typeof body !== "object" || !body.sched) return new Response("Faltan datos", { status: 400 });
    await kv.put(id, JSON.stringify({ ...body, id }));
    return json({ ok: true });
  }

  if (request.method === "DELETE") {
    await kv.delete(id);
    return json({ ok: true });
  }

  return new Response("Método no permitido", { status: 405 });
}
