// Script para verificar que el proyecto está listo para Railway
const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando que el proyecto esté listo para Railway...');
console.log('=====================================================');

const checks = [
    {
        name: 'package.json existe',
        check: () => fs.existsSync('package.json'),
        fix: 'Asegúrate que package.json esté en la raíz del proyecto'
    },
    {
        name: 'server.js existe',
        check: () => fs.existsSync('server.js'),
        fix: 'Verifica que server.js esté en la raíz del proyecto'
    },
    {
        name: 'Carpeta public existe',
        check: () => fs.existsSync('public') && fs.lstatSync('public').isDirectory(),
        fix: 'Asegúrate que la carpeta public/ exista'
    },
    {
        name: 'routes/agent.js existe',
        check: () => fs.existsSync('routes/agent.js'),
        fix: 'Verifica que routes/agent.js exista'
    },
    {
        name: 'railway.json configurado',
        check: () => fs.existsSync('railway.json'),
        fix: 'railway.json debería existir para configuración de Railway'
    },
    {
        name: '.gitignore configurado',
        check: () => fs.existsSync('.gitignore'),
        fix: 'Crea .gitignore para evitar subir archivos innecesarios'
    },
    {
        name: 'package.json tiene start script',
        check: () => {
            try {
                const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
                return pkg.scripts && pkg.scripts.start;
            } catch (e) {
                return false;
            }
        },
        fix: 'Agrega "start": "node server.js" en scripts de package.json'
    },
    {
        name: 'Dependencias necesarias en package.json',
        check: () => {
            try {
                const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
                const deps = pkg.dependencies || {};
                return deps.express && deps.playwright && deps.cors;
            } catch (e) {
                return false;
            }
        },
        fix: 'Verifica que express, playwright y cors estén en dependencies'
    }
];

let allPassed = true;

checks.forEach((check, index) => {
    const passed = check.check();
    const status = passed ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${check.name}`);
    
    if (!passed) {
        console.log(`   💡 ${check.fix}`);
        allPassed = false;
    }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
    console.log('🎉 ¡PROYECTO LISTO PARA RAILWAY!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Sube el código a GitHub');
    console.log('2. Ve a railway.app');
    console.log('3. Deploy from GitHub repo');
    console.log('4. ¡Listo!');
    console.log('\n📖 Consulta RAILWAY-SETUP.md para instrucciones detalladas');
} else {
    console.log('⚠️  HAY PROBLEMAS QUE CORREGIR');
    console.log('\n🔧 Corrige los problemas marcados arriba y vuelve a ejecutar:');
    console.log('node check-ready.js');
}

console.log('\n🚀 Una vez desplegado, comparte la URL con los usuarios');
console.log('💡 Cada usuario ingresará sus propias credenciales de Falabella');