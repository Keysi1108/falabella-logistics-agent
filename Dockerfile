FROM node:18-bullseye

WORKDIR /app

# Instalar dependencias del sistema para Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libgconf-2-4 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrender1 \
    libxtst6 \
    libxss1 \
    libdrm2 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libatspi2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copiar package.json
COPY package*.json ./

# Instalar dependencias de Node.js
RUN npm install

# Instalar Playwright browsers
RUN npx playwright install chromium
RUN npx playwright install-deps chromium

# Copiar código fuente
COPY . .

# Variables de entorno para Playwright
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true

# Exponer puerto
EXPOSE 8080

# Comando de inicio
CMD ["node", "server.js"]
