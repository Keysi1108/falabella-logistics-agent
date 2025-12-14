# 🚂 Despliegue en Railway - Guía Paso a Paso

## 📋 Preparación

### 1. Subir código a GitHub
```bash
git init
git add .
git commit -m "Initial commit - Falabella Logistics Agent"
git branch -M main
git remote add origin https://github.com/tu-usuario/falabella-agent.git
git push -u origin main
```

### 2. Configurar Railway

1. **Ve a [railway.app](https://railway.app)**
2. **Crea cuenta** con GitHub
3. **Click en "Deploy from GitHub repo"**
4. **Selecciona tu repositorio**
5. **Railway detectará automáticamente** que es Node.js

### 3. Configuración Automática

Railway configurará automáticamente:
- ✅ Node.js 18.x
- ✅ npm install
- ✅ Playwright browsers
- ✅ Puerto dinámico
- ✅ HTTPS automático

## 🔧 Variables de Entorno (Opcional)

En Railway dashboard → Settings → Environment:
```
NODE_ENV=production
HEADLESS=true
```

## 🚀 Después del Deploy

### 1. Obtener URL
- Railway te dará una URL como: `https://falabella-agent-production.up.railway.app`

### 2. Verificar funcionamiento
- Ve a: `tu-url/health`
- Debe mostrar: `{"status":"OK"}`

### 3. Probar el agente
- Accede a la URL principal
- Intenta el proceso de login

## 📊 Monitoreo y Logs

### Ver logs en tiempo real:
1. **Railway Dashboard** → Tu proyecto
2. **Deployments** → Click en el deployment activo
3. **View Logs** → Logs en tiempo real

### Comandos útiles:
```bash
# Ver logs desde CLI (opcional)
railway login
railway logs
```

## 🔄 Desarrollo Iterativo

### Flujo de trabajo:
1. **Hacer cambios** en el código local
2. **Git push** al repositorio
3. **Railway despliega automáticamente** (30-60 segundos)
4. **Probar** en la URL live
5. **Ver logs** si hay problemas
6. **Repetir**

### Para cambios rápidos:
```bash
git add .
git commit -m "Mejora en selectores de login"
git push
# Railway despliega automáticamente
```

## 🐛 Solución de Problemas

### Build falló:
- Revisa logs en Railway dashboard
- Verifica que package.json esté correcto
- Asegúrate que no hay errores de sintaxis

### Playwright no funciona:
- Railway instala automáticamente los browsers
- Si hay problemas, revisa los logs de postinstall

### Timeout en requests:
- Aumenta timeouts en routes/agent.js
- Railway tiene límite de 10 minutos por request

### App no responde:
- Verifica que el puerto sea process.env.PORT
- Revisa health check: tu-url/health

## 📈 Escalado

Railway escala automáticamente:
- **CPU**: Hasta 8 vCPUs
- **RAM**: Hasta 32GB
- **Concurrent users**: Cientos simultáneamente

## 💰 Costos

- **Hobby Plan**: $5/mes - Perfecto para empezar
- **Pro Plan**: $20/mes - Para uso intensivo

## 🎯 Próximos Pasos

1. **Deploy inicial** siguiendo esta guía
2. **Probar con credenciales reales** de Falabella
3. **Ajustar selectores** según la página real
4. **Compartir URL** con usuarios finales
5. **Iterar y mejorar** basado en feedback

## 📞 Soporte

Si tienes problemas:
1. Revisa logs en Railway dashboard
2. Verifica que la URL de Falabella sea correcta
3. Prueba localmente primero: `npm start`
4. Contacta soporte de Railway si es necesario