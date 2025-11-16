# Usar Node.js 20 Alpine
FROM node:20.19-alpine

# Instalar dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Usuario no-root
USER node

# Comando para iniciar (usar src/server.js)
CMD ["node", "src/server.js"]