# Horarios IAEV en Cloudflare Pages

Sitio: https://horarios-iaev.pages.dev

Contenido:
- index.html — la página.
- functions/api/horarios.js — guarda los horarios en Cloudflare KV (compartidos entre dispositivos).
- _routes.json — solo /api/* pasa por la función.

## Configuración en Cloudflare (Workers & Pages → horarios-iaev → Settings)
- Bindings → KV namespace: nombre de variable `HORARIOS`, namespace `horarios-iaev`.
- Variables and Secrets (opcional, recomendado): `HORARIOS_CLAVE` con la clave para guardar o eliminar.
  Sin clave, cualquiera que abra la página puede guardar o eliminar horarios. Ver los horarios no la pide.

Cada push a `main` se publica solo.
