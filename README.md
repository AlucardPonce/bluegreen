# Blue-Green Deployment - Proyecto Full Stack

## 📝 Descripción

Implementación de estrategia de despliegue Blue-Green para una aplicación Full Stack con:
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Infraestructura**: Docker + Nginx + GitHub Actions

## 🏗️ Arquitectura

```
                                    Internet
                                       |
                                   NGINX :80
                                    /     \
                          Blue (8081)   Green (8082)
                           /    \         /     \
                    Frontend  Backend  Frontend Backend
                     :80      :3000     :80    :3000
```

## 🔵🟢 Estrategia Blue-Green

La estrategia Blue-Green permite:
- **Zero Downtime**: Sin tiempo de inactividad durante el despliegue
- **Rollback Instantáneo**: Volver a la versión anterior en segundos
- **Testing en Producción**: Probar el nuevo ambiente antes de switchear

### Flujo de Despliegue

1. **Blue activo** (versión actual en producción)
2. Deploy **Green** (nueva versión)
3. Health checks en Green
4. Switch de NGINX a Green
5. Apagar Blue después de drenar conexiones

## 🚀 Despliegue Automático

### Pipeline CI/CD

El pipeline de GitHub Actions se activa en cada push a `main`:

1. **Build**: Construye imágenes Docker
2. **Push**: Sube a GitHub Container Registry
3. **Deploy**: Ejecuta deployment Blue-Green
4. **Verify**: Valida el deployment

### Variables de Entorno

El sistema usa un archivo `.env.deployment` que contiene:
```bash
ACTIVE_DEPLOYMENT=blue  # o green
```

### Puertos

| Ambiente | Frontend | Backend |
|----------|----------|---------|
| Blue     | 8081     | 3001    |
| Green    | 8082     | 3002    |
| Público  | 80 (NGINX) | - |

## 📦 Estructura del Proyecto

```
bluegreen/
├── FrontInt/              # Frontend React Vite
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── BackInt/               # Backend Node.js
│   ├── Dockerfile
│   └── server.js
├── deploy/                # Scripts de deployment
│   ├── docker-compose.blue.yml
│   ├── docker-compose.green.yml
│   ├── switch-deployment.sh
│   └── nginx.conf
└── .github/
    └── workflows/
        └── deploy.yml     # Pipeline CI/CD
```

## 🛠️ Configuración Inicial

### 1. En el VPS

```bash
# Crear estructura
mkdir -p ~/bluegreen/deploy
cd ~/bluegreen

# Crear archivo de deployment
echo "ACTIVE_DEPLOYMENT=blue" > .env.deployment

# Dar permisos al script
chmod +x deploy/switch-deployment.sh
```

### 2. En GitHub

Configurar secrets en **Settings → Secrets**:
- `SSH_PRIVATE_KEY`: Clave SSH privada
- `SSH_HOST`: IP del VPS
- `SSH_USER`: Usuario SSH

## 🔧 Deployment Manual

Para ejecutar un deployment manualmente:

```bash
cd ~/bluegreen/deploy
./switch-deployment.sh <image-tag>
```

Ejemplo:
```bash
./switch-deployment.sh latest
```

## 🔄 Rollback

Para hacer rollback, simplemente ejecuta el script nuevamente:

```bash
./switch-deployment.sh <tag-anterior>
```

El sistema automáticamente cambiará al ambiente anterior.

## 📊 Monitoreo

### Ver logs

```bash
# Logs del ambiente Blue
docker-compose -f deploy/docker-compose.blue.yml logs -f

# Logs del ambiente Green
docker-compose -f deploy/docker-compose.green.yml logs -f

# Logs de NGINX
sudo tail -f /var/log/nginx/bluegreen_access.log
sudo tail -f /var/log/nginx/bluegreen_error.log
```

### Health Checks

```bash
# Frontend
curl http://localhost:8081  # Blue
curl http://localhost:8082  # Green

# Backend
curl http://localhost:3001/health  # Blue
curl http://localhost:3002/health  # Green

# Público
curl http://tu-ip/
curl http://tu-ip/api/health
```

### Ver deployment activo

```bash
cat ~/bluegreen/.env.deployment
```

## 🔒 Seguridad

- Contenedores corren con usuario no-root
- Health checks para validar estado
- Smoke tests antes de switch
- Tiempo de drenaje de conexiones (30s)
- Validación de NGINX antes de reload

## 📈 Ventajas de esta Implementación

1. ✅ **Zero Downtime**: Sin interrupciones para usuarios
2. ✅ **Rollback Rápido**: Vuelve a la versión anterior en segundos
3. ✅ **Testing Seguro**: Prueba en ambiente de producción antes de switchear
4. ✅ **Automatización Completa**: Pipeline CI/CD automático
5. ✅ **Monitoreo**: Health checks y validaciones
6. ✅ **Simple**: Usando variables de entorno (no symlinks)

## 🌐 URL del Servicio

**Producción**: http://tu-ip-vps
