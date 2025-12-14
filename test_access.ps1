# Script de prueba simple para verificar acceso a Falabella Logistics
Write-Host "Falabella Logistics Access Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$url = "https://logistics.falabella.services/lct-dashboard/application/express-liveops/orders/?locale="

Write-Host "Probando acceso a: $url" -ForegroundColor Yellow

try {
    Write-Host "Realizando peticion HTTP..." -ForegroundColor Yellow
    
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 30 -UseBasicParsing
    
    Write-Host "Respuesta recibida!" -ForegroundColor Green
    Write-Host "Codigo de estado: $($response.StatusCode)" -ForegroundColor White
    Write-Host "Tamano de respuesta: $($response.Content.Length) bytes" -ForegroundColor White
    
    $content = $response.Content
    
    Write-Host "Analizando contenido de la pagina..." -ForegroundColor Yellow
    
    # Buscar palabras clave relacionadas con login
    $loginKeywords = @("login", "email", "password", "usuario", "contrasena", "ingresar", "entrar", "signin", "auth")
    $foundKeywords = @()
    
    foreach ($keyword in $loginKeywords) {
        if ($content -match $keyword) {
            $foundKeywords += $keyword
        }
    }
    
    # Buscar elementos HTML de formularios
    $hasForm = $content -match "<form"
    $hasEmailInput = ($content -match 'type="email"') -or ($content -match 'name="email"')
    $hasPasswordInput = $content -match 'type="password"'
    $hasSubmitButton = $content -match 'type="submit"'
    
    Write-Host "Analisis de contenido:" -ForegroundColor Cyan
    Write-Host "   Palabras clave encontradas: $($foundKeywords -join ', ')" -ForegroundColor White
    Write-Host "   Contiene formularios: $hasForm" -ForegroundColor White
    Write-Host "   Campo de email detectado: $hasEmailInput" -ForegroundColor White
    Write-Host "   Campo de contrasena detectado: $hasPasswordInput" -ForegroundColor White
    Write-Host "   Boton de envio detectado: $hasSubmitButton" -ForegroundColor White
    
    # Guardar el HTML para inspección
    $htmlFile = "falabella_page_content.html"
    $content | Out-File -FilePath $htmlFile -Encoding UTF8
    Write-Host "Contenido HTML guardado en: $htmlFile" -ForegroundColor Green
    
    # Extraer título de la página
    if ($content -match "<title>(.*?)</title>") {
        $title = $matches[1]
        Write-Host "Titulo de la pagina: $title" -ForegroundColor White
    }
    
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "RESUMEN DE LA PRUEBA" -ForegroundColor Cyan
    Write-Host "=================================================" -ForegroundColor Cyan
    
    if ($response.StatusCode -eq 200) {
        Write-Host "Acceso exitoso a la pagina" -ForegroundColor Green
        
        if ($hasEmailInput -and $hasPasswordInput) {
            Write-Host "Formulario de login detectado - Listo para automatizacion" -ForegroundColor Green
        } elseif ($foundKeywords.Count -gt 0) {
            Write-Host "Pagina relacionada con login detectada - Requiere analisis detallado" -ForegroundColor Yellow
        } else {
            Write-Host "No se detectaron elementos de login obvios" -ForegroundColor Yellow
            Write-Host "   Posibles causas:" -ForegroundColor White
            Write-Host "   - Formulario cargado por JavaScript" -ForegroundColor White
            Write-Host "   - Redireccion a pagina de login" -ForegroundColor White
            Write-Host "   - Autenticacion SSO o externa" -ForegroundColor White
        }
    }
    
    Write-Host "Proximos pasos recomendados:" -ForegroundColor Cyan
    Write-Host "   1. Revisar el archivo HTML guardado: $htmlFile" -ForegroundColor White
    Write-Host "   2. Abrir la URL manualmente en el navegador" -ForegroundColor White
    Write-Host "   3. Instalar Python + Selenium para pruebas avanzadas" -ForegroundColor White
    
} catch {
    Write-Host "Error al acceder a la pagina: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -match "SSL") {
        Write-Host "Posible problema de certificado SSL" -ForegroundColor Yellow
    } elseif ($_.Exception.Message -match "timeout") {
        Write-Host "Timeout - La pagina tardo mucho en responder" -ForegroundColor Yellow
    } elseif ($_.Exception.Message -match "404") {
        Write-Host "Pagina no encontrada - Verificar URL" -ForegroundColor Yellow
    }
    
    Write-Host "Sugerencias:" -ForegroundColor Cyan
    Write-Host "   - Verificar conexion a internet" -ForegroundColor White
    Write-Host "   - Probar acceso manual desde el navegador" -ForegroundColor White
    Write-Host "   - Verificar si la URL es correcta" -ForegroundColor White
}

Write-Host "Prueba completada" -ForegroundColor Cyan