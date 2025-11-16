# Etapa 1: Build
FROM node:20.19-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalación limpia para evitar el bug de @rollup/rollup-linux-x64-musl
RUN rm -rf node_modules package-lock.json && \
    npm install

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Etapa 2: Producción con Nginx
FROM nginx:alpine

# Copiar archivos build al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]