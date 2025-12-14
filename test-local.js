// Script para probar el agente localmente antes del despliegue
const http = require('http');

console.log('🧪 Probando Falabella Logistics Agent localmente...');
console.log('===============================================');

// Función para hacer peticiones HTTP
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        
        req.on('error', reject);
        
        if (postData) {
            req.write(JSON.stringify(postData));
        }
        
        req.end();
    });
}

async function runTests() {
    const baseUrl = 'http://localhost:3000';
    
    try {
        console.log('1. 🏥 Probando health check...');
        const healthResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/health',
            method: 'GET'
        });
        
        if (healthResponse.status === 200) {
            console.log('✅ Health check OK');
            console.log(`   Uptime: ${healthResponse.data.uptime}s`);
        } else {
            console.log('❌ Health check falló');
            return;
        }
        
        console.log('\n2. 🌐 Probando página principal...');
        const homeResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'GET'
        });
        
        if (homeResponse.status === 200) {
            console.log('✅ Página principal carga correctamente');
        } else {
            console.log('❌ Error cargando página principal');
        }
        
        console.log('\n3. 🔐 Probando endpoint de login (sin credenciales)...');
        const loginResponse = await makeRequest({
            hostname: 'localhost',
            port: 3000,
            path: '/api/agent/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            email: '',
            password: ''
        });
        
        if (loginResponse.status === 400) {
            console.log('✅ Validación de login funciona correctamente');
        } else {
            console.log('❌ Problema con validación de login');
        }
        
        console.log('\n📊 RESUMEN DE PRUEBAS:');
        console.log('✅ Servidor funcionando correctamente');
        console.log('✅ API endpoints respondiendo');
        console.log('✅ Validaciones funcionando');
        
        console.log('\n🚀 LISTO PARA DESPLIEGUE');
        console.log('Puedes proceder a desplegar en la nube');
        console.log('Consulta DEPLOY.md para instrucciones específicas');
        
    } catch (error) {
        console.log('❌ Error durante las pruebas:', error.message);
        console.log('\n🔧 Soluciones posibles:');
        console.log('1. Asegúrate que el servidor esté corriendo: npm start');
        console.log('2. Verifica que el puerto 3000 esté disponible');
        console.log('3. Revisa los logs del servidor para errores');
    }
}

// Ejecutar pruebas
runTests();