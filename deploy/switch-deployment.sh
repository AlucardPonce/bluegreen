#!/bin/bash
set -e

IMAGE_TAG=${1:-latest}
# Si recibimos un SHA completo, usar solo los primeros 7 caracteres
if [ ${#IMAGE_TAG} -eq 40 ]; then
    IMAGE_TAG="${IMAGE_TAG:0:7}"
    echo "⚠️  SHA completo recibido, usando SHA corto: $IMAGE_TAG"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$HOME/.env.deployment"

echo "🚀 Blue-Green Deployment Script"
echo "================================"
echo "📦 Image tag: $IMAGE_TAG"
echo "📂 Script directory: $SCRIPT_DIR"

# Crear archivo .env.deployment si no existe
if [ ! -f "$ENV_FILE" ]; then
    echo "📝 Creating .env.deployment file..."
    echo "ACTIVE_DEPLOYMENT=blue" > "$ENV_FILE"
fi

# Leer el deployment activo actual
source "$ENV_FILE"
echo "🔵 Current active deployment: $ACTIVE_DEPLOYMENT"

# Determinar el nuevo deployment
if [ "$ACTIVE_DEPLOYMENT" = "blue" ]; then
    NEW_DEPLOYMENT="green"
    NEW_PORT=8082
    OLD_PORT=8081
else
    NEW_DEPLOYMENT="blue"
    NEW_PORT=8081
    OLD_PORT=8082
fi

echo "🟢 New deployment target: $NEW_DEPLOYMENT (port $NEW_PORT)"

# Pull de nuevas imágenes
echo "📥 Pulling new images..."
export IMAGE_TAG
docker compose -f "$SCRIPT_DIR/docker-compose.$NEW_DEPLOYMENT.yml" pull

# Levantar el nuevo ambiente
echo "🚀 Starting $NEW_DEPLOYMENT environment..."
docker compose -f "$SCRIPT_DIR/docker-compose.$NEW_DEPLOYMENT.yml" up -d

# Esperar a que los servicios estén listos
echo "⏳ Waiting for services to be ready..."
sleep 10

# Health check del nuevo ambiente
echo "🏥 Health checking $NEW_DEPLOYMENT environment..."
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f -s http://localhost:$NEW_PORT > /dev/null; then
        echo "✅ $NEW_DEPLOYMENT environment is healthy!"
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ Attempt $RETRY_COUNT/$MAX_RETRIES - waiting for $NEW_DEPLOYMENT to be ready..."
    sleep 3
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Health check failed for $NEW_DEPLOYMENT environment!"
    echo "🔄 Rolling back..."
    docker compose -f "$SCRIPT_DIR/docker-compose.$NEW_DEPLOYMENT.yml" down
    exit 1
fi

# Actualizar NGINX para apuntar al nuevo ambiente
echo "🔄 Switching NGINX to $NEW_DEPLOYMENT..."
sudo sed -i "s/localhost:$OLD_PORT/localhost:$NEW_PORT/g" /etc/nginx/sites-available/bluegreen
sudo nginx -t
sudo systemctl reload nginx

# Actualizar el archivo de estado
echo "ACTIVE_DEPLOYMENT=$NEW_DEPLOYMENT" > "$ENV_FILE"
echo "✅ Active deployment updated to: $NEW_DEPLOYMENT"

# Dar tiempo para drenar conexiones del ambiente anterior
echo "⏳ Draining connections from $ACTIVE_DEPLOYMENT (30 seconds)..."
sleep 30

# Apagar el ambiente anterior
echo "🛑 Stopping $ACTIVE_DEPLOYMENT environment..."
docker compose -f "$SCRIPT_DIR/docker-compose.$ACTIVE_DEPLOYMENT.yml" down

echo ""
echo "🎉 Deployment completed successfully!"
echo "================================"
echo "✅ Active deployment: $NEW_DEPLOYMENT"
echo "🌐 Service running on port: $NEW_PORT"
echo "📊 Containers status:"
docker ps --filter "name=frontend\|backend"