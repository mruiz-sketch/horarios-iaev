# Horarios IAEV en Netlify

Contenido:
- index.html — la página.
- netlify/functions/horarios.mjs — guarda los horarios en Netlify Blobs (compartidos entre dispositivos).
- package.json y netlify.toml — configuración para Netlify.

## Publicar (elige una)

Importante: arrastrar la carpeta a Netlify Drop NO instala la función, y sin ella los horarios solo se guardan en cada navegador.

A) Con GitHub
1. Sube esta carpeta a un repositorio nuevo de GitHub.
2. En Netlify: Add new site → Import an existing project → elige el repositorio.
3. Deja los valores que detecta (publish ".", sin comando de build) y da Deploy.

B) Con la terminal (Netlify CLI)
1. Instala Node.js.
2. En esta carpeta: npm install
3. npx netlify-cli login
4. npx netlify-cli deploy --prod   (la primera vez te pide crear o elegir el sitio)

## Clave para guardar (recomendado)
Sin clave, cualquiera que abra la página puede guardar o eliminar horarios.
En Netlify: Site configuration → Environment variables → agrega HORARIOS_CLAVE con la clave que quieras y vuelve a publicar.
La página pedirá la clave la primera vez que alguien guarde o elimine en ese navegador; ver los horarios no la pide.
