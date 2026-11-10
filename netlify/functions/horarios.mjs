// API de horarios guardados: GET lista, PUT ?id=… guarda, DELETE ?id=… elimina.
// Los datos viven en Netlify Blobs (almacén "horarios"), compartidos entre todos los dispositivos.
// Opcional: define la variable de entorno HORARIOS_CLAVE para pedir una clave al guardar o eliminar.
import { getStore } from "@netlify/blobs";

const ID_OK = /^[0-9]{4}-[1-3]__IAEV-PA-[0-9]{2}__(P|[1-9]|10)$/;

export default async (req) => {
  const store = getStore({ name: "horarios", consistency: "strong" });
  const url = new URL(req.url);

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const items = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
    return Response.json(items.filter(Boolean), { headers: { "cache-control": "no-store" } });
  }

  const clave = Netlify.env.get("HORARIOS_CLAVE");
  if (clave && req.headers.get("x-clave") !== clave) {
    return new Response("Clave incorrecta", { status: 401 });
  }

  const id = url.searchParams.get("id") || "";
  if (!ID_OK.test(id)) return new Response("id no válido", { status: 400 });

  if (req.method === "PUT") {
    const text = await req.text();
    if (text.length > 200_000) return new Response("Horario demasiado grande", { status: 413 });
    let body;
    try { body = JSON.parse(text); } catch { return new Response("JSON no válido", { status: 400 }); }
    if (!body || typeof body !== "object" || !body.sched) return new Response("Faltan datos", { status: 400 });
    await store.setJSON(id, { ...body, id });
    return Response.json({ ok: true });
  }

  if (req.method === "DELETE") {
    await store.delete(id);
    return Response.json({ ok: true });
  }

  return new Response("Método no permitido", { status: 405 });
};

export const config = { path: "/api/horarios" };
