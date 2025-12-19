// API Service - Simulates backend API calls

class ApiService {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.token = localStorage.getItem('fintrack_token');
        this.user = JSON.parse(localStorage.getItem('fintrack_user') || 'null');
        this.transactions = JSON.parse(localStorage.getItem('fintrack_transactions') || '[]');
        this.users = DEMO_CONFIG.USERS;
        this.categories = DEMO_CONFIG.TRANSACTION_CATEGORIES;
    }

    // Simulate API delay
    async simulateDelay() {
        await Utils.sleep(500 + Math.random() * 1000);
    }

    // Get headers for API requests
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Simulate API response
    async simulateApiCall(data, success = true, errorMessage = 'An error occurred') {
        await this.simulateDelay();
        
        if (success) {
            return {
                success: true,
                data: data,
                message: 'Success',
                timestamp: new Date().toISOString()
            };
        } else {
            throw {
                success: false,
                error: errorMessage,
                statusCode: 400,
                timestamp: new Date().toISOString()
            };
        }
    }

    // Auth APIs
    async login(email, password) {
        // Find user in demo data
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Generate fake token
            const token = btoa(`${user.id}:${Date.now()}`);
            this.token = token;
            this.user = { ...user, password: undefined };
            
            // Save to localStorage
            localStorage.setItem('fintrack_token', token);
            localStorage.setItem('fintrack_user', JSON.stringify(this.user));
            
            // Initialize demo transactions if first time
            if (!localStorage.getItem('fintrack_transactions')) {
                this.initializeDemoTransactions();
            }
            
            return this.simulateApiCall({
                user: this.user,
                token: token
            });
        } else {
            return this.simulateApiCall(null, false, 'Invalid email or password');
        }
    }

    async register(userData) {
        // Check if user already exists
        const existingUser = this.users.find(u => u.email === userData.email);
        
        if (existingUser) {
            return this.simulateApiCall(null, false, 'User already exists');
        }
        
        // Create new user
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            avatar: userData.name.split(' ').map(n => n[0]).join(''),
            role: 'user'
        };
        
        this.users.push(newUser);
        
        // Auto login after registration
        return this.login(userData.email, userData.password);
    }

    async logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('fintrack_token');
        localStorage.removeItem('fintrack_user');
        
        return this.simulateApiCall({ message: 'Logged out successfully' });
    }

    async getProfile() {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        return this.simulateApiCall(this.user);
    }

    async updateProfile(userData) {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        // Update user data
        this.user = { ...this.user, ...userData };
        if (userData.name) {
            this.user.avatar = userData.name.split(' ').map(n => n[0]).join('');
        }
        
        localStorage.setItem('fintrack_user', JSON.stringify(this.user));
        
        return this.simulateApiCall(this.user);
    }

    // Transaction APIs
    async getTransactions(filters = {}) {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        let filteredTransactions = [...this.transactions];
        
        // Apply filters
        if (filters.type) {
            filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
        }
        
        if (filters.category) {
            filteredTransactions = filteredTransactions.filter(t => t.category === filters.category);
        }
        
        if (filters.startDate && filters.endDate) {
            filteredTransactions = Utils.filterTransactionsByDate(
                filteredTransactions,
                filters.startDate,
                filters.endDate
            );
        }
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredTransactions = filteredTransactions.filter(t => 
                t.description.toLowerCase().includes(searchLower) ||
                t.category.toLowerCase().includes(searchLower)
            );
        }
        
        // Sort by date (newest first)
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Pagination
        const page = filters.page || 1;
        const limit = filters.limit || APP_CONFIG.ITEMS_PER_PAGE;
        const total = filteredTransactions.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
        
        return this.simulateApiCall({
            transactions: paginatedTransactions,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    }

    async getTransaction(id) {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        const transaction = this.transactions.find(t => t.id === id);
        
        if (!transaction) {
            return this.simulateApiCall(null, false, 'Transaction not found');
        }
        
        return this.simulateApiCall(transaction);
    }

    async createTransaction(transactionData) {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        const newTransaction = {
            id: Utils.generateId('trans_'),
            userId: this.user.id,
            ...transactionData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.transactions.unshift(newTransaction);
        this.saveTransactions();
        
        return this.simulateApiCall(newTransaction);
    }

    async updateTransaction(id, transactionData) {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        const index = this.transactions.findIndex(t => t.id === id);
        
        if (index === -1) {
            return this.simulateApiCall(null, false, 'Transaction not found');
        }
        
        this.transactions[index] = {
            ...this.transactions[index],
            ...transactionData,
            updatedAt: new Date().toISOString()
        };
        
        this.saveTransactions();
        
        return this.simulateApiCall(this.transactions[index]);
    }

    async deleteTransaction(id) {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        const index = this.transactions.findIndex(t => t.id === id);
        
        if (index === -1) {
            return this.simulateApiCall(null, false, 'Transaction not found');
        }
        
        this.transactions.splice(index, 1);
        this.saveTransactions();
        
        return this.simulateApiCall({ message: 'Transaction deleted successfully' });
    }

    async getTransactionStats(period = 'month') {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        const now = new Date();
        let startDate, endDate;
        
        if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        } else if (period === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
        } else if (period === 'week') {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1);
            startDate = new Date(now.setDate(diff));
            endDate = new Date(now.setDate(diff + 6));
        }
        
        const filteredTransactions = Utils.filterTransactionsByDate(
            this.transactions,
            startDate,
            endDate
        );
        
        let totalIncome = 0;
        let totalExpense = 0;
        const categoryStats = {};
        const monthlyStats = Array(12).fill(0).map((_, i) => ({ month: i + 1, income: 0, expense: 0 }));
        
        filteredTransactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            const month = new Date(transaction.date).getMonth();
            
            if (transaction.type === 'income') {
                totalIncome += amount;
                monthlyStats[month].income += amount;
            } else {
                totalExpense += amount;
                monthlyStats[month].expense += amount;
                
                // Category stats
                if (!categoryStats[transaction.category]) {
                    categoryStats[transaction.category] = 0;
                }
                categoryStats[transaction.category] += amount;
            }
        });
        
        const categoryArray = Object.keys(categoryStats).map(category => ({
            category,
            amount: categoryStats[category],
            percentage: Utils.calculatePercentage(categoryStats[category], totalExpense)
        })).sort((a, b) => b.amount - a.amount);
        
        return this.simulateApiCall({
            period,
            totalIncome,
            totalExpense,
            balance: totalIncome - totalExpense,
            categoryStats: categoryArray,
            monthlyStats,
            transactionCount: filteredTransactions.length
        });
    }

    async getCategories() {
        return this.simulateApiCall(this.categories);
    }

    // Report APIs
    async generateReport(reportData) {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        const { type, startDate, endDate, format } = reportData;
        
        const filteredTransactions = Utils.filterTransactionsByDate(
            this.transactions,
            new Date(startDate),
            new Date(endDate)
        );
        
        let reportContent;
        
        if (type === 'financial_summary') {
            let totalIncome = 0;
            let totalExpense = 0;
            const categoryBreakdown = {};
            
            filteredTransactions.forEach(transaction => {
                const amount = parseFloat(transaction.amount);
                
                if (transaction.type === 'income') {
                    totalIncome += amount;
                } else {
                    totalExpense += amount;
                    
                    if (!categoryBreakdown[transaction.category]) {
                        categoryBreakdown[transaction.category] = 0;
                    }
                    categoryBreakdown[transaction.category] += amount;
                }
            });
            
            reportContent = {
                type: 'financial_summary',
                period: `${Utils.formatDate(startDate)} - ${Utils.formatDate(endDate)}`,
                totalIncome,
                totalExpense,
                netBalance: totalIncome - totalExpense,
                categoryBreakdown,
                transactionCount: filteredTransactions.length,
                generatedAt: new Date().toISOString()
            };
        } else if (type === 'transaction_list') {
            reportContent = {
                type: 'transaction_list',
                period: `${Utils.formatDate(startDate)} - ${Utils.formatDate(endDate)}`,
                transactions: filteredTransactions,
                totalCount: filteredTransactions.length,
                generatedAt: new Date().toISOString()
            };
        }
        
        // Generate report ID
        const reportId = Utils.generateId('report_');
        
        // Save report to localStorage
        const reports = JSON.parse(localStorage.getItem('fintrack_reports') || '[]');
        reports.unshift({
            id: reportId,
            ...reportContent,
            format
        });
        localStorage.setItem('fintrack_reports', JSON.stringify(reports));
        
        return this.simulateApiCall({
            reportId,
            ...reportContent
        });
    }

    async downloadReport(reportId, format = 'pdf') {
        if (!this.token) {
            return this.simulateApiCall(null, false, 'Not authenticated');
        }
        
        const reports = JSON.parse(localStorage.getItem('fintrack_reports') || '[]');
        const report = reports.find(r => r.id === reportId);
        
        if (!report) {
            return this.simulateApiCall(null, false, 'Report not found');
        }
        
        // Simulate file generation
        let fileContent, fileName;
        
        if (format === 'csv') {
            const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
            const data = report.transactions.map(t => ({
                Date: Utils.formatDate(t.date),
                Description: t.description,
                Category: t.category,
                Type: t.type,
                Amount: Utils.formatCurrency(t.amount)
            }));
            
            fileContent = Utils.generateCSV(data, headers);
            fileName = `report_${reportId}.csv`;
        } else if (format === 'pdf') {
            // Simulate PDF generation
            fileContent = `PDF Report ${reportId}`;
            fileName = `report_${reportId}.pdf`;
        }
        
        return this.simulateApiCall({
            reportId,
            format,
            fileContent,
            fileName,
            downloadUrl: `#download-${reportId}`
        });
    }

    // Utility methods
    initializeDemoTransactions() {
        const demoTransactions = [
            {
                id: 'trans_1',
                userId: this.user.id,
                type: 'income',
                category: 'Salary',
                description: 'Monthly Salary Deposit',
                amount: 4500.00,
                date: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'trans_2',
                userId: this.user.id,
                type: 'expense',
                category: 'Food & Dining',
                description: 'Grocery Shopping at Walmart',
                amount: 125.75,
                date: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'trans_3',
                userId: this.user.id,
                type: 'expense',
                category: 'Transportation',
                description: 'Gas Refill',
                amount: 65.50,
                date: new Date(Date.now() - 86400000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'trans_4',
                userId: this.user.id,
                type: 'income',
                category: 'Freelance',
                description: 'Web Development Project',
                amount: 1200.00,
                date: new Date(Date.now() - 2 * 86400000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'trans_5',
                userId: this.user.id,
                type: 'expense',
                category: 'Bills & Utilities',
                description: 'Electricity Bill Payment',
                amount: 85.25,
                date: new Date(Date.now() - 3 * 86400000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'trans_6',
                userId: this.user.id,
                type: 'expense',
                category: 'Entertainment',
                description: 'Movie Tickets',
                amount: 45.00,
                date: new Date(Date.now() - 4 * 86400000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'trans_7',
                userId: this.user.id,
                type: 'income',
                category: 'Investment',
                description: 'Dividend Payment',
                amount: 150.00,
                date: new Date(Date.now() - 5 * 86400000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'trans_8',
                userId: this.user.id,
                type: 'expense',
                category: 'Shopping',
                description: 'New Clothes',
                amount: 120.00,
                date: new Date(Date.now() - 6 * 86400000).toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        this.transactions = demoTransactions;
        this.saveTransactions();
    }

    saveTransactions() {
        localStorage.setItem('fintrack_transactions', JSON.stringify(this.transactions));
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }
}

// Create global API service instance
window.apiService = new ApiService();