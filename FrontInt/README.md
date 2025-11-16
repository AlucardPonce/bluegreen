# FrontInt — Resumen del proyecto (incluye resumen del backend)

Este README añade un resumen en español del proyecto frontend (`FrontInt`) y, por conveniencia, incluye también un resumen del backend (`BackInt`) que forma parte del workspace. Aquí encontrarás propósito, archivos clave, cómo ejecutar localmente y notas sobre CI/CD y despliegue.

## Descripción general

- FrontInt: aplicación frontend construida con Vite + React. Preparada para construcción en Docker y servir los archivos estáticos con Nginx.
- BackInt: API backend en Node.js con estructura MVC (controllers, models, routes, services). Preparada para ejecutarse en Docker y desplegarse vía GitHub Actions.

Ambos proyectos cuentan con Dockerfiles y workflows de GitHub Actions para construir y publicar imágenes en GitHub Container Registry (GHCR) y desplegar en un servidor VPS mediante SSH y `docker compose`.

## Estructura y archivos clave (resumen)

FrontInt (ruta: `FrontInt/`)
- `Dockerfile` — Multi-stage: build con Node 20 y etapa final con `nginx:alpine`. Copia `dist` a `/usr/share/nginx/html`. Expone el puerto 8080 en la imagen final.
- `docker-compose.yml` — Servicio `frontend` usando `ghcr.io/alucardponce/frontint:latest` con mapeo `8080:80` y red `app-network`.
- `nginx.conf` — Configuración personalizada de Nginx incluida en la imagen.
- `.github/workflows/ci-cd.yml` — Workflow que instala Node 20, hace `npm install`, ejecuta `npm run build`, construye y publica imagen Docker a GHCR y despliega al VPS copiando `docker-compose.yml` y ejecutando `docker compose pull` + `docker compose up -d`.

BackInt (ruta: `BackInt/`)
- `Dockerfile` — Base `node:18-alpine`, instala `dumb-init`, crea usuario no-root (`nodejs` uid 1001), instala dependencias de producción con `npm ci --only=production` y ejecuta `node src/server.js`.
- `docker-compose.yml` — Servicio `backend` usando `ghcr.io/alucardponce/backint:latest`, mapea `3000:3000`, usa `.env.production`, define healthcheck en `http://127.0.0.1:3000/api/health`.
- `.github/workflows/ci-cd.yml` — Workflow para build/push a GHCR y despliegue al VPS (copiar `docker-compose.yml` y ejecutar comandos por SSH).

Otros archivos relevantes
- `package.json` (en cada subproyecto) — scripts de build/start/tests.
- `src/` del backend — `controllers`, `models`, `routes`, `services` (API REST).
- `.env.production` (referenciado por `BackInt/docker-compose.yml`) — variables de entorno de producción; debe guardarse de forma segura en el servidor o en secrets.

## Cómo ejecutar localmente (rápido)

1) Usando Docker Compose (recomendado para replicar entorno de producción):

	 - Frontend (desde `FrontInt/`):
		 - Si prefieres construir localmente: `docker build -t frontint:local .` y ajustar `docker-compose.yml` para usar esa imagen, o cargar la imagen publicada en GHCR.
		 - Ejecutar: `docker compose up -d`

	 - Backend (desde `BackInt/`):
		 - Crear o proveer `.env.production` con variables necesarias.
		 - Ejecutar: `docker compose up -d`

2) Ejecutar sin contenedores (desarrollo rápido):

	 - Frontend: `npm install` y `npm run dev` (o `npm run build` y servir `dist`).
	 - Backend: `npm install` y `node src/server.js` (asegurar variables de entorno como PORT, DB URI, etc.).

Nota: los workflows de CI construyen imágenes y las suben a GHCR; el despliegue por SSH asume que el VPS puede autenticarse contra GHCR (el workflow ejecuta login con `GITHUB_TOKEN`).

## CI/CD y despliegue — notas importantes

- GitHub Actions: ambos proyectos (FrontInt y BackInt) tienen workflows que construyen, etiquetan y publican imágenes Docker a GHCR. En pushes a `main` copian `docker-compose.yml` al VPS y ejecutan `docker compose pull` y `docker compose up -d`.
- Secrets necesarios en el repositorio: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`. El workflow también usa `GITHUB_TOKEN` para login en GHCR.
- Healthcheck: el `BackInt/docker-compose.yml` define un healthcheck que valida `/api/health` — útil para que orquestadores detecten fallos.

## Recomendaciones y próximos pasos

- Añadir `README` específicos en `FrontInt/` y `BackInt/` con pasos detallados de configuración y variables de entorno.
- Incluir un `.env.sample` sin secretos para documentar variables requeridas.
- Versionado de imágenes: además de `latest`, usar tags semánticos (ej. `v1.2.3`, `sha-<short>`) para despliegues reproducibles y rollbacks.
- En CI: ejecutar tests antes del build y fallar el pipeline si los tests fallan.
- Manejo de secrets: si el frontend necesita variables en build time (Vite), pásalas como `build-args` o `secrets` en el step de `docker/build-push-action`.
- Revisar que el VPS tenga Docker y una versión de `docker compose` compatible con la sintaxis usada.

## Contacto y mantenimiento

- Owner GCR/Repo: `AlucardPonce` (según imágenes GHCR usadas).
- Mantener actualizadas las imágenes base (`node`, `nginx`) y revisar vulnerabilidades regularmente.

## Resumen final

- Frontend: proyecto Vite + React, Docker multi-stage y Nginx para servir `dist`. CI construye y publica imagen y despliega al VPS.
- Backend: Node.js con usuario no-root, `dumb-init`, healthcheck; CI publica imagen y despliega al VPS.
- Acciones sugeridas: documentar variables, añadir `.env.sample`, ejecutar tests en CI y usar tags de versión para controlar despliegues.

Si quieres, puedo:
- Guardar este resumen como `README_SUMARIO.md` en la raíz o en `FrontInt/` (ahora modifiqué `FrontInt/README.md`).
- Crear `README.md` separados para `BackInt/` y `FrontInt/` con instrucciones paso-a-paso.
- Añadir un `.env.sample` y/o un `DEPLOY.md` con instrucciones de rollback.

Indícame qué prefieres y lo hago en el próximo paso.
