class FalabellaAgentUI {
    constructor() {
        this.isConnected = false;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Search form
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');

        if (!email || !password) {
            this.showAlert('Por favor completa todos los campos', 'warning');
            return;
        }

        // Mostrar loading
        this.setLoadingState(loginBtn, true, 'Conectando...');
        this.updateStatus('loading', 'Conectando...');

        try {
            const response = await fetch('/api/agent/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                this.isConnected = true;
                this.updateStatus('connected', 'Conectado');
                this.showControlPanel();
                this.showAlert('¡Conexión exitosa!', 'success');
                
                // Limpiar formulario
                document.getElementById('loginForm').reset();
            } else {
                this.updateStatus('disconnected', 'Error de conexión');
                this.showAlert(result.message || 'Error al conectar', 'danger');
            }
        } catch (error) {
            this.updateStatus('disconnected', 'Error de conexión');
            this.showAlert('Error de conexión: ' + error.message, 'danger');
        } finally {
            this.setLoadingState(loginBtn, false, 'Conectar');
        }
    }

    async handleSearch() {
        if (!this.isConnected) {
            this.showAlert('Debes conectarte primero', 'warning');
            return;
        }

        const filters = {
            orderId: document.getElementById('orderId').value,
            status: document.getElementById('orderStatus').value,
            date: document.getElementById('orderDate').value
        };

        const searchBtn = document.querySelector('#searchForm button[type="submit"]');
        this.setLoadingState(searchBtn, true, 'Buscando...');

        try {
            const response = await fetch('/api/agent/search-orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filters })
            });

            const result = await response.json();

            if (result.success) {
                this.displayResults(result.data);
                this.showAlert(`Se encontraron ${result.data.length} órdenes`, 'info');
            } else {
                this.showAlert(result.message || 'Error en la búsqueda', 'danger');
            }
        } catch (error) {
            this.showAlert('Error en la búsqueda: ' + error.message, 'danger');
        } finally {
            this.setLoadingState(searchBtn, false, 'Buscar');
        }
    }

    async handleLogout() {
        try {
            await fetch('/api/agent/logout', { method: 'POST' });
            
            this.isConnected = false;
            this.updateStatus('disconnected', 'Desconectado');
            this.hideControlPanel();
            this.showAlert('Sesión cerrada correctamente', 'info');
        } catch (error) {
            this.showAlert('Error al cerrar sesión: ' + error.message, 'warning');
        }
    }

    displayResults(orders) {
        const resultsDiv = document.getElementById('results');
        
        if (!orders || orders.length === 0) {
            resultsDiv.innerHTML = `
                <div class="text-center text-muted">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No se encontraron órdenes con los filtros especificados</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID Orden</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        orders.forEach(order => {
            html += `
                <tr>
                    <td><strong>${order.id || 'N/A'}</strong></td>
                    <td>
                        <span class="badge bg-${this.getStatusColor(order.status)}">
                            ${order.status || 'N/A'}
                        </span>
                    </td>
                    <td>${order.date || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="agentUI.viewOrderDetails('${order.id}')">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        resultsDiv.innerHTML = html;
    }

    getStatusColor(status) {
        const statusColors = {
            'pending': 'warning',
            'processing': 'info',
            'completed': 'success',
            'cancelled': 'danger'
        };
        return statusColors[status?.toLowerCase()] || 'secondary';
    }

    viewOrderDetails(orderId) {
        this.showAlert(`Funcionalidad de detalles para orden ${orderId} - En desarrollo`, 'info');
    }

    updateStatus(status, text) {
        const indicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        indicator.className = `status-indicator status-${status}`;
        statusText.textContent = text;
    }

    showControlPanel() {
        document.getElementById('loginPanel').style.display = 'none';
        document.getElementById('controlPanel').style.display = 'block';
    }

    hideControlPanel() {
        document.getElementById('loginPanel').style.display = 'block';
        document.getElementById('controlPanel').style.display = 'none';
        
        // Limpiar resultados
        document.getElementById('results').innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-search fa-3x mb-3"></i>
                <p>Realiza una búsqueda para ver los resultados</p>
            </div>
        `;
    }

    setLoadingState(button, isLoading, text) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                ${text}
            `;
        } else {
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-${button.id === 'loginBtn' ? 'sign-in-alt' : 'search'} me-2"></i>${text}`;
        }
    }

    showAlert(message, type) {
        const alertsDiv = document.getElementById('alerts');
        const alertId = 'alert-' + Date.now();
        
        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert" id="${alertId}">
                <i class="fas fa-${this.getAlertIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        alertsDiv.insertAdjacentHTML('beforeend', alertHtml);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }

    getAlertIcon(type) {
        const icons = {
            'success': 'check-circle',
            'danger': 'exclamation-triangle',
            'warning': 'exclamation-circle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Inicializar la aplicación
const agentUI = new FalabellaAgentUI();
