#!/bin/bash
# Script de switch entre Blue y Green
#!/bin/bash

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
ENV_FILE="/home/deploy/bluegreen/.env.deployment"
NGINX_CONF="/etc/nginx/sites-available/bluegreen"
COMPOSE_DIR="/home/deploy/bluegreen/deploy"
IMAGE_TAG="${1:-latest}"

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Verificar que el archivo .env existe
if [ ! -f "$ENV_FILE" ]; then
    log "Creando archivo de deployment inicial..."
    echo "ACTIVE_DEPLOYMENT=blue" > "$ENV_FILE"
fi

# Leer el deployment activo actual
source "$ENV_FILE"
CURRENT_DEPLOYMENT="${ACTIVE_DEPLOYMENT:-blue}"

# Determinar el nuevo deployment
if [ "$CURRENT_DEPLOYMENT" = "blue" ]; then
    NEW_DEPLOYMENT="green"
    NEW_FRONTEND_PORT="8082"
    NEW_BACKEND_PORT="3002"
    OLD_FRONTEND_PORT="8081"
    OLD_BACKEND_PORT="3001"
else
    NEW_DEPLOYMENT="blue"
    NEW_FRONTEND_PORT="8081"
    NEW_BACKEND_PORT="3001"
    OLD_FRONTEND_PORT="8082"
    OLD_BACKEND_PORT="3002"
fi

log "Deployment actual: ${BLUE}$CURRENT_DEPLOYMENT${NC}"
log "Nuevo deployment: ${GREEN}$NEW_DEPLOYMENT${NC}"

# Exportar variables para docker-compose
export IMAGE_TAG="$IMAGE_TAG"
export GITHUB_REPOSITORY_OWNER="alucardponce"

# Paso 1: Levantar el nuevo ambiente
log "Paso 1: Levantando ambiente ${GREEN}$NEW_DEPLOYMENT${NC}..."
cd "$COMPOSE_DIR"
docker-compose -f "docker-compose.${NEW_DEPLOYMENT}.yml" up -d

# Paso 2: Esperar a que los contenedores estén healthy
log "Paso 2: Esperando a que los servicios estén saludables..."
MAX_WAIT=120
WAITED=0

while [ $WAITED -lt $MAX_WAIT ]; do
    FRONTEND_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "frontend-${NEW_DEPLOYMENT}" 2>/dev/null || echo "starting")
    BACKEND_HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "backend-${NEW_DEPLOYMENT}" 2>/dev/null || echo "starting")
    
    if [ "$FRONTEND_HEALTH" = "healthy" ] && [ "$BACKEND_HEALTH" = "healthy" ]; then
        log "${GREEN}✓${NC} Todos los servicios están saludables"
        break
    fi
    
    echo -n "."
    sleep 5
    WAITED=$((WAITED + 5))
done

if [ $WAITED -ge $MAX_WAIT ]; then
    error "Los servicios no respondieron a tiempo. Revisa los logs con: docker-compose -f docker-compose.${NEW_DEPLOYMENT}.yml logs"
fi

# Paso 3: Smoke test
log "Paso 3: Ejecutando smoke tests..."

# Test frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${NEW_FRONTEND_PORT}" || echo "000")
if [ "$FRONTEND_STATUS" != "200" ]; then
    error "Frontend no responde correctamente (Status: $FRONTEND_STATUS)"
fi
log "${GREEN}✓${NC} Frontend responde correctamente"

# Test backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${NEW_BACKEND_PORT}/health" || echo "000")
if [ "$BACKEND_STATUS" != "200" ]; then
    error "Backend no responde correctamente (Status: $BACKEND_STATUS)"
fi
log "${GREEN}✓${NC} Backend responde correctamente"

# Paso 4: Actualizar NGINX
log "Paso 4: Actualizando configuración de NGINX..."

cat > "$NGINX_CONF" <<EOF
server {
    listen 80;
    server_name _;
    
    access_log /var/log/nginx/bluegreen_access.log;
    error_log /var/log/nginx/bluegreen_error.log;

    # Frontend
    location / {
        proxy_pass http://localhost:${NEW_FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:${NEW_BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Validar configuración de NGINX
if ! sudo nginx -t; then
    error "La configuración de NGINX es inválida"
fi

# Recargar NGINX
sudo systemctl reload nginx
log "${GREEN}✓${NC} NGINX actualizado y recargado"

# Paso 5: Actualizar variable de deployment activo
log "Paso 5: Actualizando deployment activo..."
echo "ACTIVE_DEPLOYMENT=$NEW_DEPLOYMENT" > "$ENV_FILE"

# Paso 6: Esperar 30 segundos antes de apagar el viejo ambiente
log "Paso 6: Esperando 30 segundos para drenar conexiones..."
sleep 30

# Paso 7: Detener el ambiente anterior
log "Paso 7: Deteniendo ambiente ${BLUE}$CURRENT_DEPLOYMENT${NC}..."
docker-compose -f "docker-compose.${CURRENT_DEPLOYMENT}.yml" down

log "${GREEN}========================================${NC}"
log "${GREEN}✓ Deployment completado exitosamente${NC}"
log "${GREEN}========================================${NC}"
log "Deployment activo: ${GREEN}$NEW_DEPLOYMENT${NC}"
log "Frontend: http://localhost:${NEW_FRONTEND_PORT}"
log "Backend: http://localhost:${NEW_BACKEND_PORT}"
log ""
log "Para rollback, ejecuta este script nuevamente"