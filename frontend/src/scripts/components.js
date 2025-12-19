// UI Components

class Components {
    // Create header component
    static createHeader() {
        const user = authService.getCurrentUser();
        
        return `
            <header class="main-header">
                <div class="container">
                    <div class="header-content">
                        <a href="#/dashboard" class="logo">
                            <div class="logo-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                            <div class="logo-text">FinTrack</div>
                        </a>
                        
                        <nav>
                            <ul class="nav-links">
                                <li>
                                    <a href="#/dashboard" class="nav-link ${window.location.hash === '#/dashboard' ? 'active' : ''}">
                                        <i class="fas fa-tachometer-alt"></i> Dashboard
                                    </a>
                                </li>
                                <li>
                                    <a href="#/transactions" class="nav-link ${window.location.hash === '#/transactions' ? 'active' : ''}">
                                        <i class="fas fa-exchange-alt"></i> Transactions
                                    </a>
                                </li>
                                <li>
                                    <a href="#/reports" class="nav-link ${window.location.hash === '#/reports' ? 'active' : ''}">
                                        <i class="fas fa-file-alt"></i> Reports
                                    </a>
                                </li>
                                <li>
                                    <a href="#/budget" class="nav-link ${window.location.hash === '#/budget' ? 'active' : ''}">
                                        <i class="fas fa-wallet"></i> Budget
                                    </a>
                                </li>
                            </ul>
                        </nav>
                        
                        <div class="user-menu">
                            <div class="user-avatar">
                                ${user?.avatar || 'U'}
                            </div>
                            <div class="user-info">
                                <div class="user-name">${user?.name || 'User'}</div>
                                <div class="user-email">${user?.email || ''}</div>
                            </div>
                            <button class="btn btn-sm btn-outline" id="logoutBtn">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    // Create login form component
    static createLoginForm() {
        return `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-logo">
                            <div class="login-logo-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                        </div>
                        <h1 class="login-title">Welcome to FinTrack</h1>
                        <p class="login-subtitle">Track your finances effortlessly</p>
                    </div>
                    
                    <div class="login-body">
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="email" class="form-label">Email Address</label>
                                <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
                                <div class="form-error" id="emailError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" id="password" class="form-control" placeholder="Enter your password" required>
                                <div class="form-error" id="passwordError"></div>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-lg" id="loginBtn" style="width: 100%;">
                                    <i class="fas fa-sign-in-alt"></i> Sign In
                                </button>
                            </div>
                            
                            <div class="form-group" style="text-align: center; margin-top: 20px;">
                                <p style="color: var(--gray-color); font-size: 14px;">
                                    Don't have an account? 
                                    <a href="#/register" style="color: var(--primary-color); font-weight: 600;">Sign up here</a>
                                </p>
                                <p style="color: var(--gray-color); font-size: 13px; margin-top: 10px;">
                                    Demo credentials: <strong>admin@fintrack.com</strong> / <strong>password123</strong>
                                </p>
                            </div>
                        </form>
                    </div>
                    
                    <div class="login-footer">
                        <p>© 2024 FinTrack. All rights reserved.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Create register form component
    static createRegisterForm() {
        return `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-logo">
                            <div class="login-logo-icon">
                                <i class="fas fa-chart-line"></i>
                            </div>
                        </div>
                        <h1 class="login-title">Create Account</h1>
                        <p class="login-subtitle">Join FinTrack today</p>
                    </div>
                    
                    <div class="login-body">
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="name" class="form-label">Full Name</label>
                                <input type="text" id="name" class="form-control" placeholder="Enter your full name" required>
                                <div class="form-error" id="nameError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="email" class="form-label">Email Address</label>
                                <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
                                <div class="form-error" id="emailError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" id="password" class="form-control" placeholder="Create a password" required>
                                <div class="form-error" id="passwordError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="confirmPassword" class="form-label">Confirm Password</label>
                                <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm your password" required>
                                <div class="form-error" id="confirmPasswordError"></div>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-lg" id="registerBtn" style="width: 100%;">
                                    <i class="fas fa-user-plus"></i> Create Account
                                </button>
                            </div>
                            
                            <div class="form-group" style="text-align: center; margin-top: 20px;">
                                <p style="color: var(--gray-color); font-size: 14px;">
                                    Already have an account? 
                                    <a href="#/login" style="color: var(--primary-color); font-weight: 600;">Sign in here</a>
                                </p>
                            </div>
                        </form>
                    </div>
                    
                    <div class="login-footer">
                        <p>By signing up, you agree to our Terms and Privacy Policy</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Create dashboard component
    static createDashboard() {
        return `
            <div class="dashboard-container">
                <!-- Welcome Banner -->
                <div class="welcome-banner">
                    <div class="welcome-content">
                        <h1 class="welcome-title">Welcome back, ${authService.getCurrentUser()?.name?.split(' ')[0] || 'User'}!</h1>
                        <p class="welcome-subtitle">Here's your financial overview for ${Utils.getMonthName(new Date().getMonth() + 1)}</p>
                        <button class="btn btn-success" id="addTransactionBtn">
                            <i class="fas fa-plus"></i> Add Transaction
                        </button>
                    </div>
                </div>
                
                <!-- Stats Cards -->
                <div class="stats-grid" id="statsGrid">
                    <!-- Stats will be loaded dynamically -->
                    <div class="stat-card skeleton">
                        <div class="stat-icon skeleton"></div>
                        <div class="stat-content">
                            <h3 class="skeleton skeleton-text"></h3>
                            <div class="stat-amount skeleton skeleton-text" style="width: 120px; height: 32px;"></div>
                            <div class="stat-change skeleton skeleton-text" style="width: 80px;"></div>
                        </div>
                    </div>
                    <div class="stat-card skeleton">
                        <div class="stat-icon skeleton"></div>
                        <div class="stat-content">
                            <h3 class="skeleton skeleton-text"></h3>
                            <div class="stat-amount skeleton skeleton-text" style="width: 120px; height: 32px;"></div>
                            <div class="stat-change skeleton skeleton-text" style="width: 80px;"></div>
                        </div>
                    </div>
                    <div class="stat-card skeleton">
                        <div class="stat-icon skeleton"></div>
                        <div class="stat-content">
                            <h3 class="skeleton skeleton-text"></h3>
                            <div class="stat-amount skeleton skeleton-text" style="width: 120px; height: 32px;"></div>
                            <div class="stat-change skeleton skeleton-text" style="width: 80px;"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Income vs Expenses</h3>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline" data-period="month">Month</button>
                                <button class="btn btn-sm btn-outline" data-period="year">Year</button>
                            </div>
                        </div>
                        <div style="height: 300px;">
                            <canvas id="incomeExpenseChart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">Spending by Category</h3>
                            <select class="form-control form-control-sm" style="width: auto;" id="categoryPeriod">
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                        <div style="height: 300px;">
                            <canvas id="categoryChart"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- Recent Transactions -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-history"></i> Recent Transactions
                        </h2>
                        <a href="#/transactions" class="btn btn-sm btn-outline">
                            View All <i class="fas fa-arrow-right"></i>
                        </a>
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
                            <tbody id="recentTransactions">
                                <!-- Transactions will be loaded dynamically -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // Create transaction modal component
    static createTransactionModal() {
        return `
            <div class="modal-overlay" id="transactionModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title" id="modalTitle">Add Transaction</h3>
                        <button class="modal-close" id="closeModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="transactionForm">
                            <input type="hidden" id="transactionId">
                            
                            <div class="form-group">
                                <label for="type" class="form-label">Type</label>
                                <select id="type" class="form-control" required>
                                    <option value="">Select Type</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                                <div class="form-error" id="typeError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="category" class="form-label">Category</label>
                                <select id="category" class="form-control" required>
                                    <option value="">Select Category</option>
                                    <!-- Categories will be populated dynamically -->
                                </select>
                                <div class="form-error" id="categoryError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="description" class="form-label">Description</label>
                                <input type="text" id="description" class="form-control" placeholder="Enter description" required>
                                <div class="form-error" id="descriptionError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="amount" class="form-label">Amount</label>
                                <input type="number" id="amount" class="form-control" placeholder="0.00" min="0" step="0.01" required>
                                <div class="form-error" id="amountError"></div>
                            </div>
                            
                            <div class="form-group">
                                <label for="date" class="form-label">Date</label>
                                <input type="date" id="date" class="form-control" required>
                                <div class="form-error" id="dateError"></div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelBtn">Cancel</button>
                        <button type="submit" form="transactionForm" class="btn btn-primary" id="saveBtn">Save Transaction</button>
                    </div>
                </div>
            </div>
        `;
    }

    // Create transaction row component
    static createTransactionRow(transaction) {
        const date = Utils.formatDate(transaction.date);
        const amount = Utils.formatCurrency(transaction.amount);
        const categoryClass = transaction.category.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        return `
            <tr>
                <td>${date}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="transaction-icon ${transaction.type}">
                            <i class="${Utils.getCategoryIcon(transaction.category)}"></i>
                        </div>
                        <div>
                            <div style="font-weight: 600;">${transaction.description}</div>
                            <div style="font-size: 13px; color: var(--gray-color);">${transaction.category}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="category-tag category-${categoryClass}">
                        ${transaction.category}
                    </span>
                </td>
                <td>
                    <span class="badge ${transaction.type === 'income' ? 'badge-income' : 'badge-expense'}">
                        ${transaction.type}
                    </span>
                </td>
                <td style="font-weight: 700; ${transaction.type === 'income' ? 'color: #28a745;' : 'color: var(--danger-color);'}">
                    ${transaction.type === 'income' ? '+' : '-'}${amount}
                </td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit" data-id="${transaction.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" data-id="${transaction.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    // Create empty state component
    static createEmptyState(title, message, icon = 'fas fa-inbox', action = null) {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="${icon}"></i>
                </div>
                <h3 class="empty-title">${title}</h3>
                <p class="empty-text">${message}</p>
                ${action ? `
                    <button class="btn btn-primary" id="${action.id}">
                        <i class="${action.icon}"></i> ${action.text}
                    </button>
                ` : ''}
            </div>
        `;
    }
}