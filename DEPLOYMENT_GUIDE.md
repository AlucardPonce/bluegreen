# Guía de Deployment - Blue-Green Strategy
## Nivel Satisfactorio - Requisitos Base

### 1. Contenerización (Docker) ✅

#### 1.1 Container Registry - GitHub Container Registry (GHCR)

**Ubicación de imágenes:**
- Frontend: `ghcr.io/alucardponce/frontint:latest`
- Backend: `ghcr.io/alucardponce/backint:latest`

**Dockerfile Frontend** (`FrontInt/Dockerfile`):
- Multi-stage build con Node.js 20.19 y Nginx
- Stage 1: Build de Vite
- Stage 2: Nginx para servir archivos estáticos
- Usuario no-root para seguridad

**Dockerfile Backend** (`BackInt/Dockerfile`):
- Node.js 20.19 Alpine
- npm ci para dependencias de producción
- Usuario no-root
- Entry point: `src/server.js`

**Build Automático:**
- Pipeline CI/CD en `.github/workflows/deploy.yml`
- Build con `docker/build-push-action`
- Cache de layers para builds rápidos
- Tags: `latest` y SHA corto del commit

**Comandos de verificación:**
```bash
# Ver imágenes en el VPS
docker images | grep ghcr.io/alucardponce

# Pull manual
docker pull ghcr.io/alucardponce/frontint:latest
docker pull ghcr.io/alucardponce/backint:latest

# Inspeccionar imagen
docker inspect ghcr.io/alucardponce/frontint:latest
```

#### 1.2 Docker Compose - Orquestación de Contenedores

**Archivos:**
- `deploy/docker-compose.blue.yml`
- `deploy/docker-compose.green.yml`

**Características:**
- Network bridge personalizada (`bluegreen`)
- Health checks configurados
- Restart policy: `unless-stopped`
- Variables de entorno
- Port mapping configurado

**Comandos de verificación:**
```bash
# Ver contenedores corriendo
docker ps

# Ver compose configurado
docker compose -f ~/bluegreen/deploy/docker-compose.green.yml config

# Logs de servicios
docker compose -f ~/bluegreen/deploy/docker-compose.green.yml logs
```

---

### 2. Servidor Web (Nginx) - Proxy Inverso ✅

#### 2.1 Configuración de Nginx

**Archivo:** `deploy/nginx.conf`

**Ubicación en servidor:** `/etc/nginx/sites-available/bluegreen`

**Características implementadas:**

**a) Upstream (Backend Pool):**
```nginx
upstream bluegreen {
    server localhost:8082;  # Puerto dinámico (blue: 8081, green: 8082)
}
```

**b) Proxy Inverso:**
```nginx
location / {
    proxy_pass http://bluegreen;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**c) Logging:**
```nginx
access_log /var/log/nginx/bluegreen_access.log;
error_log /var/log/nginx/bluegreen_error.log;
```

#### 2.2 Verificación de Nginx

**Comandos:**
```bash
# Ver configuración activa
cat /etc/nginx/sites-available/bluegreen

# Verificar sintaxis
sudo nginx -t

# Ver status
sudo systemctl status nginx

# Ver logs en tiempo real
sudo tail -f /var/log/nginx/bluegreen_access.log

# Ver upstream activo
sudo nginx -T | grep "server localhost"
```

**Test de proxy:**
```bash
# Request directo al contenedor
curl http://localhost:8082

# Request a través de Nginx (puerto 80)
curl http://localhost

# Ambos deben retornar la misma respuesta
```

---

## Evidencias de Funcionamiento

### 1. Contenerización

**Prueba 1: Build de Imágenes**
```bash
# En GitHub Actions
# Ver workflow: https://github.com/AlucardPonce/bluegreen/actions
# Job: "Build and Push Docker Images"
```

**Prueba 2: Container Registry**
```bash
# Ver paquetes publicados
# https://github.com/AlucardPonce?tab=packages

docker pull ghcr.io/alucardponce/frontint:latest
docker pull ghcr.io/alucardponce/backint:latest
```

**Prueba 3: Contenedores en Ejecución**
```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
```

### 2. Nginx Proxy Inverso

**Prueba 1: Configuración Activa**
```bash
# Mostrar configuración
cat /etc/nginx/sites-enabled/bluegreen

# Verificar que está linkeado
ls -la /etc/nginx/sites-enabled/ | grep bluegreen
```

**Prueba 2: Proxy Funcionando**
```bash
# Request con headers
curl -I http://localhost

# Debería mostrar:
# HTTP/1.1 200 OK
# Server: nginx/...

# Ver logs de proxy
sudo tail -n 20 /var/log/nginx/bluegreen_access.log
```

**Prueba 3: Headers de Proxy**
```bash
# Ver headers forwarded
curl -v http://localhost 2>&1 | grep -i "X-Forwarded\|X-Real-IP"
```

---

## Arquitectura Implementada

