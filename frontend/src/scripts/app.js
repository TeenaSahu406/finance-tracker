// Main Application

class FinTrackApp {
    constructor() {
        this.api = window.apiService;
        this.auth = window.authService;
        this.chartService = window.chartService;
        this.currentPage = 'login';
        this.init();
    }

    init() {
        // Handle hash change for routing
        window.addEventListener('hashchange', () => this.route());
        
        // Handle initial load
        this.route();
        
        // Add global event listeners
        this.addGlobalEventListeners();
    }

    route() {
        const hash = window.location.hash || '#/login';
        const path = hash.replace('#', '');
        
        // Clear previous content
        document.getElementById('root').innerHTML = '';
        
        // Check authentication
        const isAuthenticated = this.auth.checkAuth();
        
        // Route to appropriate page
        if (path === '/login' || path === '/') {
            if (isAuthenticated) {
                window.location.hash = '#/dashboard';
                return;
            }
            this.showLoginPage();
        } else if (path === '/register') {
            if (isAuthenticated) {
                window.location.hash = '#/dashboard';
                return;
            }
            this.showRegisterPage();
        } else if (path === '/dashboard') {
            if (!isAuthenticated) {
                window.location.hash = '#/login';
                return;
            }
            this.showDashboard();
        } else if (path === '/transactions') {
            if (!isAuthenticated) {
                window.location.hash = '#/login';
                return;
            }
            this.showTransactionsPage();
        } else if (path === '/reports') {
            if (!isAuthenticated) {
                window.location.hash = '#/login';
                return;
            }
            this.showReportsPage();
        } else if (path === '/profile') {
            if (!isAuthenticated) {
                window.location.hash = '#/login';
                return;
            }
            this.showProfilePage();
        } else if (path === '/budget') {
            if (!isAuthenticated) {
                window.location.hash = '#/login';
                return;
            }
            this.showBudgetPage();
        } else {
            // 404 - Redirect to dashboard if authenticated, else to login
            if (isAuthenticated) {
                window.location.hash = '#/dashboard';
            } else {
                window.location.hash = '#/login';
            }
        }
    }

    showLoginPage() {
        document.getElementById('root').innerHTML = Components.createLoginForm();
        this.setupLoginForm();
    }

    showRegisterPage() {
        document.getElementById('root').innerHTML = Components.createRegisterForm();
        this.setupRegisterForm();
    }

    showDashboard() {
        document.getElementById('root').innerHTML = Components.createHeader() + Components.createDashboard();
        this.setupDashboard();
    }

    showTransactionsPage() {
        document.getElementById('root').innerHTML = Components.createHeader() + `
            <div class="dashboard-container">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-exchange-alt"></i> Transaction History
                        </h2>
                        <div style="display: flex; gap: 15px;">
                            <button class="btn btn-sm btn-outline" id="filterBtn">
                                <i class="fas fa-filter"></i> Filter
                            </button>
                            <button class="btn btn-primary" id="addTransactionBtn">
                                <i class="fas fa-plus"></i> Add Transaction
                            </button>
                        </div>
                    </div>
                    
                    <!-- Filter Bar -->
                    <div class="filter-bar" id="filterBar" style="display: none;">
                        <div class="filter-group">
                            <label class="filter-label">Type:</label>
                            <select id="filterType" class="form-control form-control-sm">
                                <option value="all">All</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label class="filter-label">Category:</label>
                            <select id="filterCategory" class="form-control form-control-sm">
                                <option value="all">All Categories</option>
                                <!-- Categories will be populated -->
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label class="filter-label">Date Range:</label>
                            <input type="date" id="filterStartDate" class="form-control form-control-sm">
                            <span>to</span>
                            <input type="date" id="filterEndDate" class="form-control form-control-sm">
                        </div>
                        
                        <button class="btn btn-sm btn-primary" id="applyFilterBtn">Apply</button>
                        <button class="btn btn-sm btn-secondary" id="clearFilterBtn">Clear</button>
                    </div>
                    
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="transactionsTableBody">
                                <!-- Transactions will be loaded -->
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- Pagination -->
                    <div class="pagination" id="pagination">
                        <!-- Pagination will be loaded -->
                    </div>
                </div>
            </div>
        `;
        
        this.setupTransactionsPage();
    }

    showReportsPage() {
        document.getElementById('root').innerHTML = Components.createHeader() + `
            <div class="dashboard-container">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-file-alt"></i> Financial Reports
                        </h2>
                    </div>
                    
                    <div class="reports-options">
                        <div class="form-group" style="flex: 1;">
                            <label class="form-label">Report Type</label>
                            <select id="reportType" class="form-control">
                                <option value="financial_summary">Financial Summary</option>
                                <option value="transaction_list">Transaction List</option>
                                <option value="category_breakdown">Category Breakdown</option>
                            </select>
                        </div>
                        
                        <div class="form-group" style="flex: 1;">
                            <label class="form-label">Date Range</label>
                            <div style="display: flex; gap: 10px;">
                                <input type="date" id="reportStartDate" class="form-control" value="${new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]}">
                                <input type="date" id="reportEndDate" class="form-control" value="${new Date().toISOString().split('T')[0]}">
                            </div>
                        </div>
                        
                        <div class="form-group" style="flex: 1;">
                            <label class="form-label">Format</label>
                            <select id="reportFormat" class="form-control">
                                <option value="pdf">PDF</option>
                                <option value="csv">CSV</option>
                                <option value="excel">Excel</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 15px; margin-top: 30px;">
                        <button class="btn btn-primary" id="generateReportBtn">
                            <i class="fas fa-cogs"></i> Generate Report
                        </button>
                        <button class="btn btn-success" id="downloadReportBtn" style="display: none;">
                            <i class="fas fa-download"></i> Download Report
                        </button>
                        <button class="btn btn-secondary" id="previewReportBtn">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                    </div>
                    
                    <!-- Report Preview -->
                    <div id="reportPreview" style="margin-top: 40px; display: none;">
                        <h3 style="margin-bottom: 20px;">Report Preview</h3>
                        <div id="previewContent" style="background: var(--gray-light); padding: 25px; border-radius: var(--border-radius);">
                            <!-- Preview will be loaded here -->
                        </div>
                    </div>
                    
                    <!-- Previous Reports -->
                    <div style="margin-top: 50px;">
                        <h3 style="margin-bottom: 20px;">Previous Reports</h3>
                        <div id="previousReports">
                            <!-- Previous reports will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupReportsPage();
    }

    showProfilePage() {
        const user = this.auth.getCurrentUser();
        
        document.getElementById('root').innerHTML = Components.createHeader() + `
            <div class="dashboard-container">
                <div class="profile-section">
                    <div class="profile-header">
                        <div class="profile-avatar">
                            ${user?.avatar || 'U'}
                        </div>
                        <div class="profile-info">
                            <h2>${user?.name || 'User'}</h2>
                            <p>${user?.email || ''}</p>
                            <p style="font-size: 14px; color: var(--gray-color);">
                                <i class="fas fa-calendar"></i> Member since: ${user?.createdAt ? Utils.formatDate(user.createdAt) : 'Recently'}
                            </p>
                        </div>
                    </div>
                    
                    <div class="profile-stats">
                        <div class="profile-stat">
                            <div class="profile-stat-value" id="totalTransactions">0</div>
                            <div class="profile-stat-label">Total Transactions</div>
                        </div>
                        <div class="profile-stat">
                            <div class="profile-stat-value" id="monthsActive">1</div>
                            <div class="profile-stat-label">Months Active</div>
                        </div>
                        <div class="profile-stat">
                            <div class="profile-stat-value" id="categoriesUsed">0</div>
                            <div class="profile-stat-label">Categories Used</div>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <h3 class="settings-title">Account Settings</h3>
                        
                        <div class="settings-group">
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Email Notifications</div>
                                    <div class="settings-description">Receive email alerts for large transactions</div>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="emailNotifications" checked>
                                    <span class="slider"></span>
                                </label>
                            </div>
                            
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Currency</div>
                                    <div class="settings-description">Default currency for all transactions</div>
                                </div>
                                <select id="currency" class="form-control form-control-sm">
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="JPY">JPY (¥)</option>
                                </select>
                            </div>
                            
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Date Format</div>
                                    <div class="settings-description">How dates are displayed</div>
                                </div>
                                <select id="dateFormat" class="form-control form-control-sm">
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="settings-group">
                            <h3 class="settings-title">Security</h3>
                            
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Two-Factor Authentication</div>
                                    <div class="settings-description">Add an extra layer of security</div>
                                </div>
                                <label class="switch">
                                    <input type="checkbox" id="twoFactorAuth">
                                    <span class="slider"></span>
                                </label>
                            </div>
                            
                            <button class="btn btn-outline" id="changePasswordBtn">
                                <i class="fas fa-key"></i> Change Password
                            </button>
                        </div>
                        
                        <div style="margin-top: 40px;">
                            <button class="btn btn-primary" id="saveSettingsBtn">
                                <i class="fas fa-save"></i> Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupProfilePage();
    }

    showBudgetPage() {
        document.getElementById('root').innerHTML = Components.createHeader() + `
            <div class="dashboard-container">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-wallet"></i> Budget Planning
                        </h2>
                        <button class="btn btn-primary" id="createBudgetBtn">
                            <i class="fas fa-plus"></i> Create Budget
                        </button>
                    </div>
                    
                    <div class="empty-state" id="budgetEmptyState" style="display: none;">
                        <div class="empty-icon">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <h3 class="empty-title">No Budgets Yet</h3>
                        <p class="empty-text">Create your first budget to start tracking your spending goals.</p>
                        <button class="btn btn-primary" id="createFirstBudgetBtn">
                            <i class="fas fa-plus"></i> Create Budget
                        </button>
                    </div>
                    
                    <div id="budgetsList">
                        <!-- Budgets will be loaded here -->
                    </div>
                </div>
                
                <div class="card" style="margin-top: 30px;">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-lightbulb"></i> Budget Tips
                        </h2>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                        <div style="background: linear-gradient(135deg, #4361ee, #3a0ca3); color: white; padding: 25px; border-radius: var(--border-radius);">
                            <h3 style="margin-bottom: 15px;">50/30/20 Rule</h3>
                            <p style="opacity: 0.9;">Allocate 50% to needs, 30% to wants, and 20% to savings.</p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #4cc9f0, #4895ef); color: white; padding: 25px; border-radius: var(--border-radius);">
                            <h3 style="margin-bottom: 15px;">Track Regularly</h3>
                            <p style="opacity: 0.9;">Review your budget weekly to stay on track.</p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #f72585, #b5179e); color: white; padding: 25px; border-radius: var(--border-radius);">
                            <h3 style="margin-bottom: 15px;">Emergency Fund</h3>
                            <p style="opacity: 0.9;">Aim for 3-6 months of expenses in savings.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.setupBudgetPage();
    }

    setupLoginForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                try {
                    await this.auth.login(email, password);
                } catch (error) {
                    console.error('Login failed:', error);
                }
            });
        }
    }

    setupRegisterForm() {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                try {
                    await this.auth.register({
                        name,
                        email,
                        password,
                        confirmPassword
                    });
                } catch (error) {
                    console.error('Registration failed:', error);
                }
            });
        }
    }

    setupDashboard() {
        // Load dashboard data
        this.loadDashboardData();
        
        // Add transaction button
        document.getElementById('addTransactionBtn')?.addEventListener('click', () => {
            this.showTransactionModal();
        });
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.auth.logout();
        });
        
        // Period buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this.updateCharts(period);
            });
        });
        
        // Category period select
        document.getElementById('categoryPeriod')?.addEventListener('change', (e) => {
            this.updateCategoryChart(e.target.value);
        });
    }

    async loadDashboardData() {
        try {
            Utils.showLoading();
            
            // Load stats
            const statsResponse = await this.api.getTransactionStats('month');
            if (statsResponse.success) {
                this.updateStats(statsResponse.data);
                this.updateCharts('month');
            }
            
            // Load recent transactions
            const transactionsResponse = await this.api.getTransactions({
                limit: 5
            });
            
            if (transactionsResponse.success) {
                this.updateRecentTransactions(transactionsResponse.data.transactions);
            }
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            this.auth.showNotification('Failed to load dashboard data', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    updateStats(data) {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;
        
        statsGrid.innerHTML = `
            <div class="stat-card stat-income">
                <div class="stat-icon">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="stat-content">
                    <h3>Total Income</h3>
                    <div class="stat-amount">${Utils.formatCurrency(data.totalIncome)}</div>
                    <div class="stat-change positive">
                        <i class="fas fa-arrow-up"></i> ${Utils.calculatePercentage(data.totalIncome, data.totalIncome + data.totalExpense)}%
                    </div>
                </div>
            </div>
            
            <div class="stat-card stat-expense">
                <div class="stat-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="stat-content">
                    <h3>Total Expenses</h3>
                    <div class="stat-amount">${Utils.formatCurrency(data.totalExpense)}</div>
                    <div class="stat-change negative">
                        <i class="fas fa-arrow-down"></i> ${Utils.calculatePercentage(data.totalExpense, data.totalIncome + data.totalExpense)}%
                    </div>
                </div>
            </div>
            
            <div class="stat-card stat-balance">
                <div class="stat-icon">
                    <i class="fas fa-wallet"></i>
                </div>
                <div class="stat-content">
                    <h3>Current Balance</h3>
                    <div class="stat-amount">${Utils.formatCurrency(data.balance)}</div>
                    <div class="stat-change ${data.balance >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-${data.balance >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                        ${data.balance >= 0 ? 'Positive' : 'Negative'}
                    </div>
                </div>
            </div>
        `;
    }

    async updateCharts(period = 'month') {
        try {
            const statsResponse = await this.api.getTransactionStats(period);
            if (statsResponse.success) {
                const data = statsResponse.data;
                
                // Update income vs expense chart
                this.chartService.createIncomeExpenseChart('incomeExpenseChart', {
                    totalIncome: data.totalIncome,
                    totalExpense: data.totalExpense
                });
                
                // Update category chart
                this.updateCategoryChart(period);
            }
        } catch (error) {
            console.error('Failed to update charts:', error);
        }
    }

    async updateCategoryChart(period = 'month') {
        try {
            const statsResponse = await this.api.getTransactionStats(period);
            if (statsResponse.success) {
                this.chartService.createCategoryChart('categoryChart', statsResponse.data.categoryStats);
            }
        } catch (error) {
            console.error('Failed to update category chart:', error);
        }
    }

    updateRecentTransactions(transactions) {
        const tbody = document.getElementById('recentTransactions');
        if (!tbody) return;
        
        if (transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            <h3 class="empty-title">No Transactions Yet</h3>
                            <p class="empty-text">Add your first transaction to get started.</p>
                            <button class="btn btn-primary" id="addFirstTransactionBtn">
                                <i class="fas fa-plus"></i> Add Transaction
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            
            document.getElementById('addFirstTransactionBtn')?.addEventListener('click', () => {
                this.showTransactionModal();
            });
            
            return;
        }
        
        tbody.innerHTML = transactions.map(transaction => 
            Components.createTransactionRow(transaction)
        ).join('');
        
        // Add event listeners to action buttons
        tbody.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.showTransactionModal(id);
            });
        });
        
        tbody.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.deleteTransaction(id);
            });
        });
    }

    showTransactionModal(transactionId = null) {
        // Create modal HTML
        const modalHtml = Components.createTransactionModal();
        document.getElementById('modal-container').innerHTML = modalHtml;
        
        // Show modal
        const modal = document.getElementById('transactionModal');
        modal.classList.add('active');
        
        // Set today's date as default
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        
        // Load categories
        this.loadCategories();
        
        // Load transaction data if editing
        if (transactionId) {
            this.loadTransactionForEdit(transactionId);
        }
        
        // Setup event listeners
        this.setupTransactionModalEvents(transactionId);
    }

    async loadCategories() {
        try {
            const response = await this.api.getCategories();
            if (response.success) {
                const categories = response.data;
                const categorySelect = document.getElementById('category');
                
                // Clear existing options except the first one
                while (categorySelect.options.length > 1) {
                    categorySelect.remove(1);
                }
                
                // Add income categories
                const incomeGroup = document.createElement('optgroup');
                incomeGroup.label = 'Income Categories';
                categories.income.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    incomeGroup.appendChild(option);
                });
                categorySelect.appendChild(incomeGroup);
                
                // Add expense categories
                const expenseGroup = document.createElement('optgroup');
                expenseGroup.label = 'Expense Categories';
                categories.expense.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    expenseGroup.appendChild(option);
                });
                categorySelect.appendChild(expenseGroup);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    async loadTransactionForEdit(transactionId) {
        try {
            const response = await this.api.getTransaction(transactionId);
            if (response.success) {
                const transaction = response.data;
                
                document.getElementById('transactionId').value = transaction.id;
                document.getElementById('type').value = transaction.type;
                document.getElementById('category').value = transaction.category;
                document.getElementById('description').value = transaction.description;
                document.getElementById('amount').value = transaction.amount;
                document.getElementById('date').value = transaction.date.split('T')[0];
                
                document.getElementById('modalTitle').textContent = 'Edit Transaction';
                document.getElementById('saveBtn').textContent = 'Update Transaction';
            }
        } catch (error) {
            console.error('Failed to load transaction:', error);
            this.auth.showNotification('Failed to load transaction', 'error');
        }
    }

    setupTransactionModalEvents(transactionId) {
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');
        const closeBtn = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        
        // Close modal events
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.getElementById('modal-container').innerHTML = '';
                }, 300);
            });
        });
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.getElementById('modal-container').innerHTML = '';
                }, 300);
            }
        });
        
        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const transactionData = {
                type: document.getElementById('type').value,
                category: document.getElementById('category').value,
                description: document.getElementById('description').value,
                amount: parseFloat(document.getElementById('amount').value),
                date: document.getElementById('date').value
            };
            
            try {
                if (transactionId) {
                    // Update existing transaction
                    await this.api.updateTransaction(transactionId, transactionData);
                    this.auth.showNotification('Transaction updated successfully!', 'success');
                } else {
                    // Create new transaction
                    await this.api.createTransaction(transactionData);
                    this.auth.showNotification('Transaction added successfully!', 'success');
                }
                
                // Close modal
                modal.classList.remove('active');
                setTimeout(() => {
                    document.getElementById('modal-container').innerHTML = '';
                }, 300);
                
                // Refresh dashboard if on dashboard page
                if (window.location.hash === '#/dashboard') {
                    this.loadDashboardData();
                }
                
                // Refresh transactions if on transactions page
                if (window.location.hash === '#/transactions') {
                    this.loadTransactions();
                }
                
            } catch (error) {
                console.error('Failed to save transaction:', error);
                this.auth.showNotification(error.message || 'Failed to save transaction', 'error');
            }
        });
        
        // Update categories based on type selection
        document.getElementById('type').addEventListener('change', (e) => {
            this.updateCategoryOptions(e.target.value);
        });
    }

    updateCategoryOptions(type) {
        const categorySelect = document.getElementById('category');
        const categories = DEMO_CONFIG.TRANSACTION_CATEGORIES[type] || [];
        
        // Clear existing options except the first one
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        
        // Add categories for selected type
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    async deleteTransaction(transactionId) {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }
        
        try {
            await this.api.deleteTransaction(transactionId);
            this.auth.showNotification('Transaction deleted successfully!', 'success');
            
            // Refresh data
            if (window.location.hash === '#/dashboard') {
                this.loadDashboardData();
            } else if (window.location.hash === '#/transactions') {
                this.loadTransactions();
            }
            
        } catch (error) {
            console.error('Failed to delete transaction:', error);
            this.auth.showNotification(error.message || 'Failed to delete transaction', 'error');
        }
    }

    setupTransactionsPage() {
        // Load transactions
        this.loadTransactions();
        
        // Add transaction button
        document.getElementById('addTransactionBtn')?.addEventListener('click', () => {
            this.showTransactionModal();
        });
        
        // Filter button
        document.getElementById('filterBtn')?.addEventListener('click', () => {
            const filterBar = document.getElementById('filterBar');
            filterBar.style.display = filterBar.style.display === 'none' ? 'flex' : 'none';
        });
        
        // Apply filter button
        document.getElementById('applyFilterBtn')?.addEventListener('click', () => {
            this.loadTransactions();
        });
        
        // Clear filter button
        document.getElementById('clearFilterBtn')?.addEventListener('click', () => {
            document.getElementById('filterType').value = 'all';
            document.getElementById('filterCategory').value = 'all';
            document.getElementById('filterStartDate').value = '';
            document.getElementById('filterEndDate').value = '';
            this.loadTransactions();
        });
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.auth.logout();
        });
        
        // Load categories for filter
        this.loadFilterCategories();
    }

    async loadTransactions(page = 1) {
        try {
            Utils.showLoading();
            
            // Get filter values
            const filters = {
                type: document.getElementById('filterType')?.value,
                category: document.getElementById('filterCategory')?.value,
                startDate: document.getElementById('filterStartDate')?.value,
                endDate: document.getElementById('filterEndDate')?.value,
                page: page,
                limit: APP_CONFIG.ITEMS_PER_PAGE
            };
            
            // Remove undefined filters
            Object.keys(filters).forEach(key => {
                if (!filters[key] || filters[key] === 'all') {
                    delete filters[key];
                }
            });
            
            const response = await this.api.getTransactions(filters);
            
            if (response.success) {
                this.updateTransactionsTable(response.data.transactions);
                this.updatePagination(response.data.pagination);
            }
            
        } catch (error) {
            console.error('Failed to load transactions:', error);
            this.auth.showNotification('Failed to load transactions', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    updateTransactionsTable(transactions) {
        const tbody = document.getElementById('transactionsTableBody');
        if (!tbody) return;
        
        if (transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-icon">
                                <i class="fas fa-exchange-alt"></i>
                            </div>
                            <h3 class="empty-title">No Transactions Found</h3>
                            <p class="empty-text">${document.getElementById('filterType')?.value !== 'all' ? 'Try changing your filters' : 'Add your first transaction to get started'}</p>
                            ${document.getElementById('filterType')?.value !== 'all' ? '' : `
                                <button class="btn btn-primary" id="addFirstTransactionBtn2">
                                    <i class="fas fa-plus"></i> Add Transaction
                                </button>
                            `}
                        </div>
                    </td>
                </tr>
            `;
            
            document.getElementById('addFirstTransactionBtn2')?.addEventListener('click', () => {
                this.showTransactionModal();
            });
            
            return;
        }
        
        tbody.innerHTML = transactions.map(transaction => 
            Components.createTransactionRow(transaction)
        ).join('');
        
        // Add event listeners to action buttons
        tbody.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.showTransactionModal(id);
            });
        });
        
        tbody.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').dataset.id;
                this.deleteTransaction(id);
            });
        });
    }

    updatePagination(pagination) {
        const paginationEl = document.getElementById('pagination');
        if (!paginationEl) return;
        
        if (pagination.totalPages <= 1) {
            paginationEl.innerHTML = '';
            return;
        }
        
        let html = '';
        
        // Previous button
        html += `
            <button class="page-item ${pagination.page === 1 ? 'disabled' : ''}" 
                    ${pagination.page === 1 ? 'disabled' : ''} 
                    onclick="app.loadTransactions(${pagination.page - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        const maxPagesToShow = 5;
        let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);
        
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button class="page-item ${i === pagination.page ? 'active' : ''}" 
                        onclick="app.loadTransactions(${i})">
                    ${i}
                </button>
            `;
        }
        
        // Next button
        html += `
            <button class="page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}" 
                    ${pagination.page === pagination.totalPages ? 'disabled' : ''} 
                    onclick="app.loadTransactions(${pagination.page + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        paginationEl.innerHTML = html;
    }

    async loadFilterCategories() {
        try {
            const response = await this.api.getCategories();
            if (response.success) {
                const categories = response.data;
                const select = document.getElementById('filterCategory');
                
                // Add expense categories to filter
                categories.expense.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    }

    setupReportsPage() {
        // Set default dates
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        
        document.getElementById('reportStartDate').value = firstDay.toISOString().split('T')[0];
        document.getElementById('reportEndDate').value = today.toISOString().split('T')[0];
        
        // Generate report button
        document.getElementById('generateReportBtn').addEventListener('click', () => {
            this.generateReport();
        });
        
        // Preview report button
        document.getElementById('previewReportBtn').addEventListener('click', () => {
            this.previewReport();
        });
        
        // Download report button
        document.getElementById('downloadReportBtn').addEventListener('click', () => {
            this.downloadReport();
        });
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.auth.logout();
        });
        
        // Load previous reports
        this.loadPreviousReports();
    }

    async generateReport() {
        try {
            Utils.showLoading();
            
            const reportData = {
                type: document.getElementById('reportType').value,
                startDate: document.getElementById('reportStartDate').value,
                endDate: document.getElementById('reportEndDate').value,
                format: document.getElementById('reportFormat').value
            };
            
            const response = await this.api.generateReport(reportData);
            
            if (response.success) {
                this.auth.showNotification('Report generated successfully!', 'success');
                
                // Show download button
                document.getElementById('downloadReportBtn').style.display = 'inline-flex';
                document.getElementById('downloadReportBtn').dataset.reportId = response.data.reportId;
                
                // Store current report data
                window.currentReport = response.data;
                
                // Update preview
                this.updateReportPreview(response.data);
                
                // Reload previous reports
                this.loadPreviousReports();
            }
            
        } catch (error) {
            console.error('Failed to generate report:', error);
            this.auth.showNotification(error.message || 'Failed to generate report', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async downloadReport() {
        try {
            const reportId = document.getElementById('downloadReportBtn').dataset.reportId;
            const format = document.getElementById('reportFormat').value;
            
            if (!reportId) {
                this.auth.showNotification('Please generate a report first', 'error');
                return;
            }
            
            Utils.showLoading();
            
            const response = await this.api.downloadReport(reportId, format);
            
            if (response.success) {
                // Download the file
                Utils.downloadFile(
                    response.data.fileContent,
                    response.data.fileName,
                    format === 'csv' ? 'text/csv' : 'application/pdf'
                );
                
                this.auth.showNotification('Report downloaded successfully!', 'success');
            }
            
        } catch (error) {
            console.error('Failed to download report:', error);
            this.auth.showNotification(error.message || 'Failed to download report', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async previewReport() {
        try {
            Utils.showLoading();
            
            const reportData = {
                type: document.getElementById('reportType').value,
                startDate: document.getElementById('reportStartDate').value,
                endDate: document.getElementById('reportEndDate').value,
                format: 'preview'
            };
            
            const response = await this.api.generateReport(reportData);
            
            if (response.success) {
                this.updateReportPreview(response.data);
                document.getElementById('reportPreview').style.display = 'block';
                
                // Scroll to preview
                document.getElementById('reportPreview').scrollIntoView({ behavior: 'smooth' });
            }
            
        } catch (error) {
            console.error('Failed to preview report:', error);
            this.auth.showNotification(error.message || 'Failed to preview report', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    updateReportPreview(reportData) {
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) return;
        
        let html = '';
        
        if (reportData.type === 'financial_summary') {
            html = `
                <h4>Financial Summary Report</h4>
                <p><strong>Period:</strong> ${reportData.period}</p>
                <p><strong>Generated:</strong> ${Utils.formatDate(reportData.generatedAt)}</p>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 25px;">
                    <div style="background: white; padding: 20px; border-radius: var(--border-radius); text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #28a745;">${Utils.formatCurrency(reportData.totalIncome)}</div>
                        <div style="color: var(--gray-color); font-size: 14px;">Total Income</div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: var(--border-radius); text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: var(--danger-color);">${Utils.formatCurrency(reportData.totalExpense)}</div>
                        <div style="color: var(--gray-color); font-size: 14px;">Total Expenses</div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: var(--border-radius); text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${Utils.formatCurrency(reportData.netBalance)}</div>
                        <div style="color: var(--gray-color); font-size: 14px;">Net Balance</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <h5>Category Breakdown</h5>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background: var(--gray-light);">
                                <th style="padding: 12px; text-align: left;">Category</th>
                                <th style="padding: 12px; text-align: right;">Amount</th>
                                <th style="padding: 12px; text-align: right;">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            Object.entries(reportData.categoryBreakdown).forEach(([category, amount]) => {
                const percentage = Utils.calculatePercentage(amount, reportData.totalExpense);
                html += `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid var(--gray-light);">${category}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--gray-light); text-align: right; font-weight: 600;">${Utils.formatCurrency(amount)}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--gray-light); text-align: right;">${percentage}%</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
        } else if (reportData.type === 'transaction_list') {
            html = `
                <h4>Transaction List Report</h4>
                <p><strong>Period:</strong> ${reportData.period}</p>
                <p><strong>Total Transactions:</strong> ${reportData.totalCount}</p>
                <p><strong>Generated:</strong> ${Utils.formatDate(reportData.generatedAt)}</p>
                
                <div style="margin-top: 25px;">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background: var(--gray-light);">
                                <th style="padding: 12px; text-align: left;">Date</th>
                                <th style="padding: 12px; text-align: left;">Description</th>
                                <th style="padding: 12px; text-align: left;">Category</th>
                                <th style="padding: 12px; text-align: left;">Type</th>
                                <th style="padding: 12px; text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            reportData.transactions.slice(0, 10).forEach(transaction => {
                html += `
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid var(--gray-light);">${Utils.formatDate(transaction.date)}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--gray-light);">${transaction.description}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--gray-light);">${transaction.category}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--gray-light);">
                            <span style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${transaction.type === 'income' ? 'rgba(40, 167, 69, 0.15)' : 'rgba(247, 37, 133, 0.15)'}; color: ${transaction.type === 'income' ? '#28a745' : 'var(--danger-color)'}">
                                ${transaction.type}
                            </span>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--gray-light); text-align: right; font-weight: 600; color: ${transaction.type === 'income' ? '#28a745' : 'var(--danger-color)'}">
                            ${transaction.type === 'income' ? '+' : '-'}${Utils.formatCurrency(transaction.amount)}
                        </td>
                    </tr>
                `;
            });
            
            if (reportData.transactions.length > 10) {
                html += `
                    <tr>
                        <td colspan="5" style="padding: 12px; text-align: center; color: var(--gray-color);">
                            ... and ${reportData.transactions.length - 10} more transactions
                        </td>
                    </tr>
                `;
            }
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        previewContent.innerHTML = html;
    }

    async loadPreviousReports() {
        try {
            const reports = JSON.parse(localStorage.getItem('fintrack_reports') || '[]');
            const container = document.getElementById('previousReports');
            
            if (!container) return;
            
            if (reports.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: var(--gray-color);">
                        <i class="fas fa-file-alt" style="font-size: 48px; margin-bottom: 20px;"></i>
                        <p>No reports generated yet</p>
                    </div>
                `;
                return;
            }
            
            let html = '<div style="display: grid; gap: 20px;">';
            
            reports.slice(0, 5).forEach(report => {
                html += `
                    <div class="report-card">
                        <div class="report-header">
                            <div>
                                <h4 class="report-title">${report.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                                <p class="report-period">${report.period}</p>
                            </div>
                            <div>
                                <span style="padding: 6px 12px; background: var(--gray-light); border-radius: 20px; font-size: 12px; font-weight: 600;">
                                    ${report.format ? report.format.toUpperCase() : 'PDF'}
                                </span>
                            </div>
                        </div>
                        
                        <div class="report-stats">
                            ${report.type === 'financial_summary' ? `
                                <div class="report-stat">
                                    <div class="report-stat-value" style="color: #28a745;">${Utils.formatCurrency(report.totalIncome)}</div>
                                    <div class="report-stat-label">Income</div>
                                </div>
                                <div class="report-stat">
                                    <div class="report-stat-value" style="color: var(--danger-color);">${Utils.formatCurrency(report.totalExpense)}</div>
                                    <div class="report-stat-label">Expenses</div>
                                </div>
                                <div class="report-stat">
                                    <div class="report-stat-value" style="color: var(--primary-color);">${Utils.formatCurrency(report.netBalance)}</div>
                                    <div class="report-stat-label">Net Balance</div>
                                </div>
                            ` : `
                                <div class="report-stat">
                                    <div class="report-stat-value">${report.totalCount}</div>
                                    <div class="report-stat-label">Transactions</div>
                                </div>
                            `}
                        </div>
                        
                        <div class="report-actions">
                            <button class="btn btn-sm btn-outline" onclick="app.downloadReportById('${report.id}')">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="app.previewReportById('${report.id}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error('Failed to load previous reports:', error);
        }
    }

    async downloadReportById(reportId) {
        try {
            Utils.showLoading();
            
            const reports = JSON.parse(localStorage.getItem('fintrack_reports') || '[]');
            const report = reports.find(r => r.id === reportId);
            
            if (!report) {
                this.auth.showNotification('Report not found', 'error');
                return;
            }
            
            // Generate CSV content
            if (report.type === 'transaction_list' && report.transactions) {
                const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
                const data = report.transactions.map(t => ({
                    Date: Utils.formatDate(t.date),
                    Description: t.description,
                    Category: t.category,
                    Type: t.type,
                    Amount: Utils.formatCurrency(t.amount)
                }));
                
                const csvContent = Utils.generateCSV(data, headers);
                Utils.downloadFile(csvContent, `report_${reportId}.csv`, 'text/csv');
                
                this.auth.showNotification('Report downloaded successfully!', 'success');
            } else {
                this.auth.showNotification('This report type cannot be downloaded', 'error');
            }
            
        } catch (error) {
            console.error('Failed to download report:', error);
            this.auth.showNotification('Failed to download report', 'error');
        } finally {
            Utils.hideLoading();
        }
    }

    async previewReportById(reportId) {
        try {
            const reports = JSON.parse(localStorage.getItem('fintrack_reports') || '[]');
            const report = reports.find(r => r.id === reportId);
            
            if (!report) {
                this.auth.showNotification('Report not found', 'error');
                return;
            }
            
            this.updateReportPreview(report);
            document.getElementById('reportPreview').style.display = 'block';
            
            // Scroll to preview
            document.getElementById('reportPreview').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Failed to preview report:', error);
            this.auth.showNotification('Failed to preview report', 'error');
        }
    }

    setupProfilePage() {
        // Load profile data
        this.loadProfileData();
        
        // Save settings button
        document.getElementById('saveSettingsBtn')?.addEventListener('click', () => {
            this.saveProfileSettings();
        });
        
        // Change password button
        document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
            this.showChangePasswordModal();
        });
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.auth.logout();
        });
    }

    async loadProfileData() {
        try {
            const user = this.auth.getCurrentUser();
            const transactions = JSON.parse(localStorage.getItem('fintrack_transactions') || '[]');
            
            // Filter transactions for current user
            const userTransactions = transactions.filter(t => t.userId === user?.id);
            
            // Calculate stats
            document.getElementById('totalTransactions').textContent = userTransactions.length;
            
            // Calculate months active (simplified)
            if (userTransactions.length > 0) {
                const dates = userTransactions.map(t => new Date(t.date));
                const minDate = new Date(Math.min(...dates));
                const monthsDiff = (new Date().getFullYear() - minDate.getFullYear()) * 12 + 
                                 (new Date().getMonth() - minDate.getMonth());
                document.getElementById('monthsActive').textContent = Math.max(1, monthsDiff + 1);
            }
            
            // Calculate unique categories
            const categories = new Set(userTransactions.map(t => t.category));
            document.getElementById('categoriesUsed').textContent = categories.size;
            
        } catch (error) {
            console.error('Failed to load profile data:', error);
        }
    }

    async saveProfileSettings() {
        try {
            const settings = {
                emailNotifications: document.getElementById('emailNotifications').checked,
                currency: document.getElementById('currency').value,
                dateFormat: document.getElementById('dateFormat').value,
                twoFactorAuth: document.getElementById('twoFactorAuth').checked
            };
            
            // Save to localStorage
            localStorage.setItem('fintrack_settings', JSON.stringify(settings));
            
            this.auth.showNotification('Settings saved successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.auth.showNotification('Failed to save settings', 'error');
        }
    }

    showChangePasswordModal() {
        const modalHtml = `
            <div class="modal-overlay active" id="passwordModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Change Password</h3>
                        <button class="modal-close" id="closePasswordModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="passwordForm">
                            <div class="form-group">
                                <label for="currentPassword" class="form-label">Current Password</label>
                                <input type="password" id="currentPassword" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="newPassword" class="form-label">New Password</label>
                                <input type="password" id="newPassword" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                                <input type="password" id="confirmNewPassword" class="form-control" required>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelPasswordBtn">Cancel</button>
                        <button type="submit" form="passwordForm" class="btn btn-primary" id="savePasswordBtn">Change Password</button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').innerHTML = modalHtml;
        
        // Setup event listeners
        const modal = document.getElementById('passwordModal');
        const closeBtn = document.getElementById('closePasswordModal');
        const cancelBtn = document.getElementById('cancelPasswordBtn');
        const form = document.getElementById('passwordForm');
        
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.getElementById('modal-container').innerHTML = '';
                }, 300);
            });
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmNewPassword) {
                this.auth.showNotification('New passwords do not match', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                this.auth.showNotification('Password must be at least 6 characters long', 'error');
                return;
            }
            
            // In a real app, this would call an API to change password
            this.auth.showNotification('Password changed successfully!', 'success');
            
            // Close modal
            modal.classList.remove('active');
            setTimeout(() => {
                document.getElementById('modal-container').innerHTML = '';
            }, 300);
        });
    }

    setupBudgetPage() {
        // Load budgets
        this.loadBudgets();
        
        // Create budget buttons
        document.getElementById('createBudgetBtn')?.addEventListener('click', () => {
            this.showCreateBudgetModal();
        });
        
        document.getElementById('createFirstBudgetBtn')?.addEventListener('click', () => {
            this.showCreateBudgetModal();
        });
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            this.auth.logout();
        });
    }

    async loadBudgets() {
        try {
            const budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]');
            const container = document.getElementById('budgetsList');
            const emptyState = document.getElementById('budgetEmptyState');
            
            if (!container || !emptyState) return;
            
            if (budgets.length === 0) {
                container.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }
            
            container.style.display = 'block';
            emptyState.style.display = 'none';
            
            let html = '<div style="display: grid; gap: 20px;">';
            
            budgets.forEach(budget => {
                const spent = budget.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
                const total = budget.categories.reduce((sum, cat) => sum + cat.amount, 0);
                const percentage = (spent / total) * 100;
                
                html += `
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">${budget.name}</h3>
                            <div>
                                <span style="font-weight: 600; color: ${percentage > 100 ? 'var(--danger-color)' : percentage > 80 ? 'var(--warning-color)' : 'var(--success-color)'}">
                                    ${percentage.toFixed(1)}% spent
                                </span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                <span>Budget Progress</span>
                                <span>${Utils.formatCurrency(spent)} / ${Utils.formatCurrency(total)}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min(percentage, 100)}%; background: ${percentage > 100 ? 'var(--danger-color)' : percentage > 80 ? 'var(--warning-color)' : 'var(--success-color)'};"></div>
                            </div>
                        </div>
                        
                        <div style="display: grid; gap: 15px;">
                `;
                
                budget.categories.forEach(category => {
                    const catPercentage = category.spent ? (category.spent / category.amount) * 100 : 0;
                    
                    html += `
                        <div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span>${category.name}</span>
                                <span>${Utils.formatCurrency(category.spent || 0)} / ${Utils.formatCurrency(category.amount)}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min(catPercentage, 100)}%; background: ${Utils.getCategoryColor(category.name)};"></div>
                            </div>
                        </div>
                    `;
                });
                
                html += `
                        </div>
                        
                        <div style="display: flex; gap: 10px; margin-top: 20px;">
                            <button class="btn btn-sm btn-outline" onclick="app.editBudget('${budget.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-danger" onclick="app.deleteBudget('${budget.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
            container.innerHTML = html;
            
        } catch (error) {
            console.error('Failed to load budgets:', error);
        }
    }

    showCreateBudgetModal(budgetId = null) {
        const modalHtml = `
            <div class="modal-overlay active" id="budgetModal">
                <div class="modal" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3 class="modal-title">${budgetId ? 'Edit Budget' : 'Create New Budget'}</h3>
                        <button class="modal-close" id="closeBudgetModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="budgetForm">
                            <input type="hidden" id="budgetId" value="${budgetId || ''}">
                            
                            <div class="form-group">
                                <label for="budgetName" class="form-label">Budget Name</label>
                                <input type="text" id="budgetName" class="form-control" placeholder="e.g., Monthly Budget" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="budgetPeriod" class="form-label">Period</label>
                                <select id="budgetPeriod" class="form-control">
                                    <option value="monthly">Monthly</option>
                                    <option value="yearly">Yearly</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            
                            <div id="categoriesContainer">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                    <label class="form-label">Categories</label>
                                    <button type="button" class="btn btn-sm btn-outline" id="addCategoryBtn">
                                        <i class="fas fa-plus"></i> Add Category
                                    </button>
                                </div>
                                
                                <div id="categoryList">
                                    <!-- Categories will be added here -->
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelBudgetBtn">Cancel</button>
                        <button type="submit" form="budgetForm" class="btn btn-primary" id="saveBudgetBtn">
                            ${budgetId ? 'Update Budget' : 'Create Budget'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modal-container').innerHTML = modalHtml;
        
        // Add initial category row
        this.addBudgetCategoryRow();
        
        // Setup event listeners
        const modal = document.getElementById('budgetModal');
        const closeBtn = document.getElementById('closeBudgetModal');
        const cancelBtn = document.getElementById('cancelBudgetBtn');
        const form = document.getElementById('budgetForm');
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        
        [closeBtn, cancelBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    document.getElementById('modal-container').innerHTML = '';
                }, 300);
            });
        });
        
        addCategoryBtn.addEventListener('click', () => {
            this.addBudgetCategoryRow();
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBudget(budgetId);
        });
        
        // Load budget data if editing
        if (budgetId) {
            this.loadBudgetForEdit(budgetId);
        }
    }

    addBudgetCategoryRow(category = { name: '', amount: 0 }) {
        const container = document.getElementById('categoryList');
        const rowId = `category_${Date.now()}`;
        
        const row = document.createElement('div');
        row.className = 'category-row';
        row.style.cssText = `
            display: grid;
            grid-template-columns: 2fr 1fr auto;
            gap: 10px;
            margin-bottom: 10px;
            align-items: end;
        `;
        
        row.innerHTML = `
            <div>
                <label class="form-label">Category Name</label>
                <input type="text" class="form-control category-name" value="${category.name}" placeholder="e.g., Groceries" required>
            </div>
            <div>
                <label class="form-label">Amount</label>
                <input type="number" class="form-control category-amount" value="${category.amount}" min="0" step="0.01" required>
            </div>
            <div>
                <button type="button" class="btn btn-sm btn-danger remove-category" style="margin-bottom: 8px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(row);
        
        // Add remove event listener
        row.querySelector('.remove-category').addEventListener('click', () => {
            if (container.children.length > 1) {
                row.remove();
            }
        });
    }

    async loadBudgetForEdit(budgetId) {
        try {
            const budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]');
            const budget = budgets.find(b => b.id === budgetId);
            
            if (!budget) return;
            
            document.getElementById('budgetName').value = budget.name;
            document.getElementById('budgetPeriod').value = budget.period;
            
            // Clear existing categories
            document.getElementById('categoryList').innerHTML = '';
            
            // Add categories
            budget.categories.forEach(category => {
                this.addBudgetCategoryRow({
                    name: category.name,
                    amount: category.amount
                });
            });
            
        } catch (error) {
            console.error('Failed to load budget:', error);
            this.auth.showNotification('Failed to load budget', 'error');
        }
    }

    saveBudget(budgetId = null) {
        try {
            const name = document.getElementById('budgetName').value;
            const period = document.getElementById('budgetPeriod').value;
            
            // Collect categories
            const categories = [];
            document.querySelectorAll('.category-row').forEach(row => {
                const nameInput = row.querySelector('.category-name');
                const amountInput = row.querySelector('.category-amount');
                
                if (nameInput && amountInput) {
                    categories.push({
                        name: nameInput.value,
                        amount: parseFloat(amountInput.value) || 0,
                        spent: 0 // Initialize spent amount
                    });
                }
            });
            
            if (categories.length === 0) {
                this.auth.showNotification('Please add at least one category', 'error');
                return;
            }
            
            // Get existing budgets
            const budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]');
            
            if (budgetId) {
                // Update existing budget
                const index = budgets.findIndex(b => b.id === budgetId);
                if (index !== -1) {
                    budgets[index] = {
                        ...budgets[index],
                        name,
                        period,
                        categories,
                        updatedAt: new Date().toISOString()
                    };
                }
            } else {
                // Create new budget
                const newBudget = {
                    id: `budget_${Date.now()}`,
                    userId: this.auth.getCurrentUser()?.id,
                    name,
                    period,
                    categories,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                budgets.push(newBudget);
            }
            
            // Save to localStorage
            localStorage.setItem('fintrack_budgets', JSON.stringify(budgets));
            
            // Close modal
            const modal = document.getElementById('budgetModal');
            modal.classList.remove('active');
            setTimeout(() => {
                document.getElementById('modal-container').innerHTML = '';
            }, 300);
            
            // Refresh budget list
            this.loadBudgets();
            
            this.auth.showNotification(`Budget ${budgetId ? 'updated' : 'created'} successfully!`, 'success');
            
        } catch (error) {
            console.error('Failed to save budget:', error);
            this.auth.showNotification('Failed to save budget', 'error');
        }
    }

    editBudget(budgetId) {
        this.showCreateBudgetModal(budgetId);
    }

    deleteBudget(budgetId) {
        if (!confirm('Are you sure you want to delete this budget?')) {
            return;
        }
        
        try {
            const budgets = JSON.parse(localStorage.getItem('fintrack_budgets') || '[]');
            const filteredBudgets = budgets.filter(b => b.id !== budgetId);
            
            localStorage.setItem('fintrack_budgets', JSON.stringify(filteredBudgets));
            
            this.loadBudgets();
            this.auth.showNotification('Budget deleted successfully!', 'success');
            
        } catch (error) {
            console.error('Failed to delete budget:', error);
            this.auth.showNotification('Failed to delete budget', 'error');
        }
    }

    addGlobalEventListeners() {
        // Make app instance available globally for inline event handlers
        window.app = this;
        
        // Handle clicks on links with hash
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) {
                    window.location.hash = href;
                }
            }
        });
        
        // Handle back/forward browser buttons
        window.addEventListener('popstate', () => {
            this.route();
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.finTrackApp = new FinTrackApp();
});