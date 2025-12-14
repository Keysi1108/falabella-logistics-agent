// Script de prueba simple usando Node.js nativo
const https = require('https');
const fs = require('fs');

console.log('🤖 Falabella Logistics Simple Test');
console.log('=====================================');

const url = 'https://logistics.falabella.services/lct-dashboard/application/express-liveops/orders/?locale=';

console.log(`🌐 Probando acceso a: ${url}`);

const options = {
    hostname: 'logistics.falabella.services',
    port: 443,
    path: '/lct-dashboard/application/express-liveops/orders/?locale=',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

const req = https.request(options, (res) => {
    console.log(`✅ Respuesta recibida: ${res.statusCode}`);
    console.log(`📄 Headers:`, res.headers);
    
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`📊 Tamaño de respuesta: ${data.length} bytes`);
        
        // Analizar contenido
        const hasLogin = data.toLowerCase().includes('login');
        const hasEmail = data.toLowerCase().includes('email');
        const hasPassword = data.toLowerCase().includes('password');
        const hasForm = data.toLowerCase().includes('<form');
        const hasReact = data.includes('React') || data.includes('react');
        const hasCloudflare = data.includes('cloudflare') || data.includes('__CF');
        
        console.log('\n🔍 Análisis de contenido:');
        console.log(`   Contiene "login": ${hasLogin}`);
        console.log(`   Contiene "email": ${hasEmail}`);
        console.log(`   Contiene "password": ${hasPassword}`);
        console.log(`   Contiene formularios: ${hasForm}`);
        console.log(`   Es aplicación React: ${hasReact}`);
        console.log(`   Usa Cloudflare: ${hasCloudflare}`);
        
        // Extraer título
        const titleMatch = data.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
            console.log(`📄 Título: ${titleMatch[1]}`);
        }
        
        // Guardar HTML
        fs.writeFileSync('page_content_node.html', data);
        console.log('💾 Contenido guardado en: page_content_node.html');
        
        console.log('\n📋 Conclusiones:');
        if (hasReact) {
            console.log('✅ Es una aplicación React - necesitamos navegador real');
            console.log('💡 Recomendación: Usar Playwright o Selenium');
        }
        
        if (hasCloudflare) {
            console.log('⚠️  Usa protección Cloudflare - puede requerir navegador real');
        }
        
        console.log('\n🎯 Próximos pasos:');
        console.log('1. Instalar Node.js si no está disponible');
        console.log('2. Instalar Playwright: npm install playwright');
        console.log('3. Ejecutar el agente completo');
        
        console.log('\n🏁 Prueba completada');
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
        console.log('🌐 Error de DNS - verificar conexión a internet');
    } else if (error.code === 'ECONNREFUSED') {
        console.log('🚫 Conexión rechazada - servidor no disponible');
    } else if (error.code === 'ETIMEDOUT') {
        console.log('⏰ Timeout - servidor tardó mucho en responder');
    }
});

req.end();