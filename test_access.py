"""
Script de prueba para verificar acceso a Falabella Logistics
"""
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

def test_falabella_access():
    print("🚀 Iniciando prueba de acceso a Falabella Logistics...")
    
    # Configurar Chrome
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    # chrome_options.add_argument("--headless")  # Comentado para ver el navegador
    
    try:
        # Inicializar driver con auto-instalación
        print("📱 Configurando y abriendo navegador...")
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
        driver.maximize_window()
        
        # URL de Falabella Logistics
        url = "https://logistics.falabella.services/lct-dashboard/application/express-liveops/orders/?locale="
        
        print(f"🌐 Navegando a: {url}")
        driver.get(url)
        
        # Esperar a que cargue la página
        print("⏳ Esperando que cargue la página...")
        time.sleep(5)
        
        # Obtener información básica de la página
        page_title = driver.title
        current_url = driver.current_url
        
        print(f"📄 Título de la página: {page_title}")
        print(f"🔗 URL actual: {current_url}")
        
        # Buscar elementos de login comunes
        login_elements = []
        
        # Posibles selectores de campos de email/usuario
        email_selectors = [
            'input[type="email"]',
            'input[name="email"]',
            'input[name="username"]',
            'input[id*="email"]',
            'input[id*="user"]',
            'input[placeholder*="email"]',
            'input[placeholder*="correo"]'
        ]
        
        # Posibles selectores de campos de contraseña
        password_selectors = [
            'input[type="password"]',
            'input[name="password"]',
            'input[id*="password"]',
            'input[placeholder*="password"]',
            'input[placeholder*="contraseña"]'
        ]
        
        print("\n🔍 Buscando elementos de login...")
        
        # Buscar campos de email
        for selector in email_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    print(f"✅ Campo de email encontrado: {selector}")
                    login_elements.append(f"Email: {selector}")
            except:
                pass
        
        # Buscar campos de contraseña
        for selector in password_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    print(f"✅ Campo de contraseña encontrado: {selector}")
                    login_elements.append(f"Password: {selector}")
            except:
                pass
        
        # Buscar botones de login
        button_selectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:contains("Login")',
            'button:contains("Ingresar")',
            'button:contains("Entrar")',
            '.login-button',
            '#login-button'
        ]
        
        for selector in button_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    print(f"✅ Botón de login encontrado: {selector}")
                    login_elements.append(f"Button: {selector}")
            except:
                pass
        
        # Obtener el HTML de la página para análisis
        page_source = driver.page_source
        
        # Buscar palabras clave relacionadas con login
        keywords = ["login", "email", "password", "usuario", "contraseña", "ingresar", "entrar"]
        found_keywords = []
        
        for keyword in keywords:
            if keyword.lower() in page_source.lower():
                found_keywords.append(keyword)
        
        print(f"\n📝 Palabras clave encontradas: {', '.join(found_keywords)}")
        
        # Tomar screenshot
        screenshot_path = "falabella_page_screenshot.png"
        driver.save_screenshot(screenshot_path)
        print(f"📸 Screenshot guardado: {screenshot_path}")
        
        # Mostrar resumen
        print("\n" + "="*50)
        print("📊 RESUMEN DE LA PRUEBA")
        print("="*50)
        print(f"✅ Acceso exitoso: {'Sí' if driver.current_url else 'No'}")
        print(f"📄 Título: {page_title}")
        print(f"🔗 URL final: {current_url}")
        print(f"🔍 Elementos de login encontrados: {len(login_elements)}")
        
        if login_elements:
            print("\n🎯 Elementos detectados:")
            for element in login_elements:
                print(f"   - {element}")
        else:
            print("\n⚠️  No se detectaron elementos de login estándar")
            print("   Esto puede significar:")
            print("   - La página requiere autenticación previa")
            print("   - Usa un sistema de login personalizado")
            print("   - Hay redirecciones o JavaScript que cargan el formulario")
        
        # Mantener el navegador abierto por un momento para inspección manual
        print(f"\n⏰ Manteniendo navegador abierto por 10 segundos para inspección...")
        time.sleep(10)
        
        return True
        
    except Exception as e:
        print(f"❌ Error durante la prueba: {str(e)}")
        return False
        
    finally:
        try:
            driver.quit()
            print("🔒 Navegador cerrado")
        except:
            pass

if __name__ == "__main__":
    print("🤖 Falabella Logistics Access Test")
    print("=" * 40)
    
    # Verificar si Selenium está instalado
    try:
        import selenium
        print(f"✅ Selenium instalado: versión {selenium.__version__}")
    except ImportError:
        print("❌ Selenium no está instalado")
        print("💡 Para instalar: pip install selenium")
        exit(1)
    
    # Ejecutar prueba
    success = test_falabella_access()
    
    if success:
        print("\n🎉 Prueba completada exitosamente")
    else:
        print("\n💥 La prueba falló")