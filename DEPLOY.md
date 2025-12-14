# 🚀 Guía de Despliegue en la Nube

## Opciones de Despliegue

### 1. Railway (Recomendado - Más fácil)

**Pasos:**
1. Ve a [railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Haz "Deploy from GitHub repo"
4. Selecciona este repositorio
5. Railway detectará automáticamente Node.js
6. ¡Listo! Te dará una URL pública

**Ventajas:**
- Configuración automática
- Soporte nativo para Playwright
- Escalado automático
- SSL gratuito

### 2. Heroku

**Pasos:**
1. Instala Heroku CLI
2. Ejecuta:
```bash
heroku create falabella-logistics-agent
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/jontewks/puppeteer-heroku-buildpack
git push heroku main
```

**Nota:** Heroku requiere buildpack especial para Playwright

### 3. Render

**Pasos:**
1. Ve a [render.com](https://render.com)
2. Conecta GitHub
3. Selecciona "Web Service"
4. Configura:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Deploy

### 4. Vercel (Solo para pruebas)

**Limitación:** Vercel tiene límites de tiempo que pueden afectar Playwright
```bash
npm install -g vercel
vercel --prod
```

## ⚙️ Variables de Entorno

Para producción, configura:
```
NODE_ENV=production
PORT=3000
HEADLESS=true
```

## 🔧 Configuración Post-Despliegue

1. **Verificar funcionamiento:**
   - Ve a `tu-url/health`
   - Debe mostrar: `{"status":"OK"}`

2. **Probar el agente:**
   - Accede a la URL principal
   - Intenta hacer login con credenciales de prueba

3. **Monitoreo:**
   - Revisa los logs del servicio
   - Configura alertas si es necesario

## 🛡️ Seguridad

- El agente NO almacena credenciales
- Cada sesión es independiente
- Usa HTTPS automáticamente en producción

## 📊 Uso

Una vez desplegado:
1. Comparte la URL con los usuarios
2. Cada usuario ingresa sus propias credenciales
3. El agente automatiza las tareas en tiempo real

## 🐛 Solución de Problemas

**Error de Playwright:**
- Asegúrate que el buildpack esté configurado
- Verifica que `postinstall` se ejecute correctamente

**Timeout en login:**
- Ajusta los selectores CSS en `routes/agent.js`
- Aumenta los timeouts si es necesario

**Error 503:**
- El servicio puede estar iniciando
- Espera 1-2 minutos y reintenta