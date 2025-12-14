const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const path = require('path');
const express = require('express');
const cors = require('cors');

// Importar el servidor backend
const agentRoutes = require('./routes/agent');

let mainWindow;
let server;
const PORT = 3000;

// Crear servidor Express
function createServer() {
    const expressApp = express();
    
    // Middleware
    expressApp.use(cors());
    expressApp.use(express.json());
    expressApp.use(express.static('public'));
    
    // Rutas
    expressApp.use('/api/agent', agentRoutes);
    
    // Ruta principal
    expressApp.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
    
    // Iniciar servidor
    server = expressApp.listen(PORT, () => {
        console.log(`🚀 Servidor interno corriendo en puerto ${PORT}`);
    });
}

// Crear ventana principal
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        show: false, // No mostrar hasta que esté listo
        titleBarStyle: 'default'
    });

    // Cargar la aplicación
    mainWindow.loadURL(`http://localhost:${PORT}`);

    // Mostrar cuando esté listo
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        
        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            dialog.showMessageBox(mainWindow, {
                type: 'info',
                title: 'Falabella Logistics Agent',
                message: '¡Bienvenido!',
                detail: 'El agente está listo para usar. Ingresa tus credenciales para comenzar.',
                buttons: ['Entendido']
            });
        }, 2000);
    });

    // Manejar enlaces externos
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Evento al cerrar
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Crear menú personalizado
    createMenu();
}

// Crear menú de la aplicación
function createMenu() {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Reiniciar Agente',
                    accelerator: 'Ctrl+R',
                    click: () => {
                        mainWindow.reload();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Salir',
                    accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Ver',
            submenu: [
                {
                    label: 'Recargar',
                    accelerator: 'F5',
                    click: () => {
                        mainWindow.reload();
                    }
                },
                {
                    label: 'Herramientas de Desarrollador',
                    accelerator: 'F12',
                    click: () => {
                        mainWindow.webContents.toggleDevTools();
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Zoom In',
                    accelerator: 'Ctrl+=',
                    click: () => {
                        const currentZoom = mainWindow.webContents.getZoomLevel();
                        mainWindow.webContents.setZoomLevel(currentZoom + 1);
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'Ctrl+-',
                    click: () => {
                        const currentZoom = mainWindow.webContents.getZoomLevel();
                        mainWindow.webContents.setZoomLevel(currentZoom - 1);
                    }
                },
                {
                    label: 'Zoom Normal',
                    accelerator: 'Ctrl+0',
                    click: () => {
                        mainWindow.webContents.setZoomLevel(0);
                    }
                }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                {
                    label: 'Acerca de',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Acerca de Falabella Logistics Agent',
                            message: 'Falabella Logistics Agent v1.0.0',
                            detail: 'Agente automatizado para el dashboard de Falabella Logistics.\n\nDesarrollado para facilitar las tareas diarias de logística.',
                            buttons: ['OK']
                        });
                    }
                },
                {
                    label: 'Soporte',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'Soporte',
                            message: 'Información de Soporte',
                            detail: 'Para soporte técnico o reportar problemas:\n\n• Revisa que tus credenciales sean correctas\n• Verifica tu conexión a internet\n• Contacta al administrador del sistema',
                            buttons: ['OK']
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// Eventos de la aplicación
app.whenReady().then(() => {
    // Crear servidor primero
    createServer();
    
    // Esperar un poco y crear ventana
    setTimeout(() => {
        createWindow();
    }, 1000);

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    // Cerrar servidor
    if (server) {
        server.close();
    }
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    // Cerrar servidor antes de salir
    if (server) {
        server.close();
    }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
    console.error('Error no capturado:', error);
    
    if (mainWindow) {
        dialog.showErrorBox('Error', `Se produjo un error inesperado:\n\n${error.message}`);
    }
});

// Configuración de seguridad
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});

console.log('🤖 Falabella Logistics Agent iniciando...');