FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

# Cambiar a usuario root para instalar dependencias
USER root

# Instalar Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Copiar package.json
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Copiar código fuente
COPY . .

# Variables de entorno
ENV NODE_ENV=production
ENV PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true

# Exponer puerto
EXPOSE 8080

# Cambiar a usuario playwright para seguridad
USER playwright

# Comando de inicio
CMD ["node", "server.js"]
