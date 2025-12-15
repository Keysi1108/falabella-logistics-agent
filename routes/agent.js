const express = require('express');
const { chromium } = require('playwright');
const router = express.Router();

class FalabellaAgent {
    constructor() {
        this.browser = null;
        this.page = null;
        this.isLoggedIn = false;
    }

    async initialize() {
        const isProduction = process.env.NODE_ENV === 'production';
        
        this.browser = await chromium.launch({ 
            headless: isProduction, // Headless en producción
            slowMo: isProduction ? 500 : 1000, // Más rápido en producción
            args: isProduction ? [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ] : []
        });
        
        this.page = await this.browser.newPage();
        
        // Configurar viewport y user agent
        await this.page.setViewportSize({ width: 1280, height: 720 });
        await this.page.setExtraHTTPHeaders({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });
        
        // Configurar timeouts más largos para entornos de nube
        this.page.setDefaultTimeout(isProduction ? 30000 : 10000);
        this.page.setDefaultNavigationTimeout(isProduction ? 60000 : 30000);
    }

    async login(email, password) {
        try {
            console.log('🔐 Iniciando proceso de login...');
            
            // Navegar a la página de login
            await this.page.goto('https://logistics.falabella.services/lct-dashboard/application/express-liveops/orders/?locale=', {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            console.log('📄 Página cargada, esperando elementos React...');
            
            // Esperar más tiempo para que React cargue completamente
            await this.page.waitForTimeout(5000);
            
            // Tomar screenshot para debug
            await this.page.screenshot({ path: 'debug_page_loaded.png' });
            console.log('📸 Screenshot guardado: debug_page_loaded.png');
            
            // Buscar elementos de login con selectores más amplios
            const loginSelectors = [
                'input[type="email"]',
                'input[name="email"]', 
                'input[name="username"]',
                'input[id*="email"]',
                'input[id*="user"]',
                'input[placeholder*="email"]',
                'input[placeholder*="correo"]',
                'input[placeholder*="usuario"]',
                '[data-testid*="email"]',
                '[data-testid*="username"]'
            ];
            
            let emailField = null;
            console.log('🔍 Buscando campo de email...');
            
            for (const selector of loginSelectors) {
                try {
                    await this.page.waitForSelector(selector, { timeout: 2000 });
                    emailField = selector;
                    console.log(`✅ Campo de email encontrado: ${selector}`);
                    break;
                } catch (e) {
                    console.log(`❌ No encontrado: ${selector}`);
                }
            }
            
            if (!emailField) {
                // Si no encontramos campos, analizar la página
                const pageContent = await this.page.content();
                console.log('📝 Analizando contenido de la página...');
                
                // Buscar si hay redirección o elementos específicos
                if (pageContent.includes('login') || pageContent.includes('signin')) {
                    console.log('🔄 Página contiene referencias de login, pero elementos no visibles');
                } else {
                    console.log('❓ No se detectaron referencias de login en la página');
                }
                
                // Intentar hacer click en elementos que podrían abrir el login
                const possibleLoginTriggers = [
                    'button:has-text("Login")',
                    'button:has-text("Ingresar")', 
                    'a:has-text("Login")',
                    'a:has-text("Ingresar")',
                    '[data-testid*="login"]',
                    '.login-button',
                    '#login-button'
                ];
                
                for (const trigger of possibleLoginTriggers) {
                    try {
                        await this.page.click(trigger);
                        console.log(`🖱️ Click en posible trigger: ${trigger}`);
                        await this.page.waitForTimeout(2000);
                        break;
                    } catch (e) {
                        // Continuar con el siguiente
                    }
                }
                
                throw new Error('No se encontraron campos de login. La página podría requerir autenticación previa o usar un sistema de login diferente.');
            }
            
            // Buscar campo de contraseña
            const passwordSelectors = [
                'input[type="password"]',
                'input[name="password"]',
                'input[id*="password"]',
                'input[placeholder*="password"]',
                'input[placeholder*="contraseña"]',
                '[data-testid*="password"]'
            ];
            
            let passwordField = null;
            console.log('🔍 Buscando campo de contraseña...');
            
            for (const selector of passwordSelectors) {
                try {
                    await this.page.waitForSelector(selector, { timeout: 2000 });
                    passwordField = selector;
                    console.log(`✅ Campo de contraseña encontrado: ${selector}`);
                    break;
                } catch (e) {
                    console.log(`❌ No encontrado: ${selector}`);
                }
            }
            
            if (!passwordField) {
                throw new Error('No se encontró campo de contraseña');
            }
            
            // Llenar credenciales
            console.log('📝 Llenando credenciales...');
            await this.page.fill(emailField, email);
            await this.page.waitForTimeout(1000);
            await this.page.fill(passwordField, password);
            await this.page.waitForTimeout(1000);
            
            // Tomar screenshot antes del login
            await this.page.screenshot({ path: 'debug_before_login.png' });
            console.log('📸 Screenshot antes del login: debug_before_login.png');
            
            // Buscar y hacer click en botón de login
            const submitSelectors = [
                'button[type="submit"]',
                'input[type="submit"]',
                'button:has-text("Login")',
                'button:has-text("Ingresar")',
                'button:has-text("Entrar")',
                '[data-testid*="login"]',
                '[data-testid*="submit"]'
            ];
            
            let submitted = false;
            for (const selector of submitSelectors) {
                try {
                    await this.page.click(selector);
                    console.log(`🖱️ Click en botón de login: ${selector}`);
                    submitted = true;
                    break;
                } catch (e) {
                    console.log(`❌ No se pudo hacer click: ${selector}`);
                }
            }
            
            if (!submitted) {
                // Intentar enviar con Enter
                await this.page.press(passwordField, 'Enter');
                console.log('⌨️ Enviado con Enter');
            }
            
            // Esperar respuesta del login
            console.log('⏳ Esperando respuesta del login...');
            await this.page.waitForTimeout(3000);
            
            // Verificar si el login fue exitoso
            const currentUrl = this.page.url();
            console.log(`🔗 URL actual después del login: ${currentUrl}`);
            
            // Tomar screenshot después del login
            await this.page.screenshot({ path: 'debug_after_login.png' });
            console.log('📸 Screenshot después del login: debug_after_login.png');
            
            // Verificar si hay elementos que indiquen login exitoso
            const successIndicators = [
                '[data-testid*="dashboard"]',
                '.dashboard',
                '[data-testid*="user"]',
                '.user-menu',
                'button:has-text("Logout")',
                'button:has-text("Cerrar sesión")'
            ];
            
            let loginSuccess = false;
            for (const indicator of successIndicators) {
                try {
                    await this.page.waitForSelector(indicator, { timeout: 2000 });
                    console.log(`✅ Indicador de éxito encontrado: ${indicator}`);
                    loginSuccess = true;
                    break;
                } catch (e) {
                    // Continuar buscando
                }
            }
            
            if (loginSuccess || currentUrl !== 'https://logistics.falabella.services/lct-dashboard/application/express-liveops/orders/?locale=') {
                this.isLoggedIn = true;
                console.log('✅ Login exitoso');
                return { success: true, message: 'Login exitoso' };
            } else {
                console.log('❌ Login falló - no se detectaron cambios');
                return { success: false, message: 'Login falló - verificar credenciales' };
            }
            
        } catch (error) {
            console.error('❌ Error en login:', error.message);
            
            // Tomar screenshot del error
            try {
                await this.page.screenshot({ path: 'debug_error.png' });
                console.log('📸 Screenshot del error: debug_error.png');
            } catch (e) {
                // Ignorar errores de screenshot
            }
            
            return { success: false, message: `Error en login: ${error.message}` };
        }
    }

    async searchOrders(filters = {}) {
        try {
            if (!this.isLoggedIn) {
                throw new Error('Debe iniciar sesión primero');
            }

            console.log('🔍 Buscando órdenes...');
            
            // Implementar lógica de búsqueda según los filtros
            // Esto dependerá de la estructura real de la página
            
            // Ejemplo de extracción de datos
            const orders = await this.page.evaluate(() => {
                // Buscar tabla de órdenes o elementos de datos
                const rows = document.querySelectorAll('table tbody tr, .order-item');
                return Array.from(rows).map(row => {
                    // Extraer datos de cada fila/elemento
                    return {
                        id: row.querySelector('.order-id')?.textContent?.trim(),
                        status: row.querySelector('.status')?.textContent?.trim(),
                        date: row.querySelector('.date')?.textContent?.trim(),
                        // Agregar más campos según la estructura
                    };
                });
            });

            console.log(`📦 Encontradas ${orders.length} órdenes`);
            return { success: true, data: orders };
            
        } catch (error) {
            console.error('❌ Error buscando órdenes:', error.message);
            return { success: false, message: `Error: ${error.message}` };
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.isLoggedIn = false;
        }
    }
}

// Instancia global del agente
let agent = null;

// Limpiar agente después de inactividad (para Railway)
let inactivityTimer = null;
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutos

function resetInactivityTimer() {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }
    
    inactivityTimer = setTimeout(async () => {
        if (agent) {
            console.log('🧹 Cerrando agente por inactividad...');
            await agent.close();
            agent = null;
        }
    }, INACTIVITY_TIMEOUT);
}

// Rutas API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email y contraseña son requeridos' 
            });
        }

        // Cerrar agente anterior si existe
        if (agent) {
            await agent.close();
        }

        // Crear nueva instancia del agente
        agent = new FalabellaAgent();
        await agent.initialize();
        
        const result = await agent.login(email, password);
        
        // Resetear timer de inactividad
        if (result.success) {
            resetInactivityTimer();
        }
        
        res.json(result);
        
    } catch (error) {
        console.error('Error en /login:', error);
        res.status(500).json({ 
            success: false, 
            message: `Error del servidor: ${error.message}` 
        });
    }
});

router.post('/search-orders', async (req, res) => {
    try {
        if (!agent || !agent.isLoggedIn) {
            return res.status(401).json({ 
                success: false, 
                message: 'Debe iniciar sesión primero' 
            });
        }

        const filters = req.body.filters || {};
        const result = await agent.searchOrders(filters);
        
        // Resetear timer de inactividad
        resetInactivityTimer();
        
        res.json(result);
        
    } catch (error) {
        console.error('Error en /search-orders:', error);
        res.status(500).json({ 
            success: false, 
            message: `Error del servidor: ${error.message}` 
        });
    }
});

router.post('/logout', async (req, res) => {
    try {
        if (agent) {
            await agent.close();
            agent = null;
        }
        res.json({ success: true, message: 'Sesión cerrada' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `Error: ${error.message}` 
        });
    }
});

module.exports = router;
