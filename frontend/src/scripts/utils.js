// Utility Functions

class Utils {
    // Format currency
    static formatCurrency(amount, currency = APP_CONFIG.CURRENCY) {
        const currencySymbol = DEMO_CONFIG.CURRENCIES.find(c => c.code === currency)?.symbol || '$';
        return `${currencySymbol}${parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
    }

    // Format date
    static formatDate(date, format = APP_CONFIG.DATE_FORMAT) {
        const d = new Date(date);
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const year = d.getFullYear();
        
        switch (format) {
            case 'MM/DD/YYYY':
                return `${month}/${day}/${year}`;
            case 'DD/MM/YYYY':
                return `${day}/${month}/${year}`;
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            default:
                return d.toLocaleDateString();
        }
    }

    // Generate random ID
    static generateId(prefix = '') {
        return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Validate email
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate password
    static validatePassword(password) {
        return password.length >= 6;
    }

    // Get category color
    static getCategoryColor(category) {
        const colors = {
            'Salary': '#28a745',
            'Freelance': '#007bff',
            'Investment': '#6f42c1',
            'Business': '#20c997',
            'Gift': '#fd7e14',
            'Food & Dining': '#ffc107',
            'Shopping': '#e83e8c',
            'Transportation': '#17a2b8',
            'Entertainment': '#dc3545',
            'Bills & Utilities': '#6c757d',
            'Healthcare': '#20c997',
            'Education': '#6610f2',
            'Travel': '#fd7e14',
            'Other': '#6c757d'
        };
        return colors[category] || '#6c757d';
    }

    // Get category icon
    static getCategoryIcon(category) {
        const icons = {
            'Salary': 'fas fa-money-bill-wave',
            'Freelance': 'fas fa-laptop-code',
            'Investment': 'fas fa-chart-line',
            'Business': 'fas fa-briefcase',
            'Gift': 'fas fa-gift',
            'Food & Dining': 'fas fa-utensils',
            'Shopping': 'fas fa-shopping-bag',
            'Transportation': 'fas fa-car',
            'Entertainment': 'fas fa-film',
            'Bills & Utilities': 'fas fa-file-invoice-dollar',
            'Healthcare': 'fas fa-heartbeat',
            'Education': 'fas fa-graduation-cap',
            'Travel': 'fas fa-plane',
            'Other': 'fas fa-ellipsis-h'
        };
        return icons[category] || 'fas fa-circle';
    }

    // Parse date string to ISO format
    static parseDate(dateString) {
        if (!dateString) return new Date().toISOString();
        return new Date(dateString).toISOString();
    }

    // Calculate percentage
    static calculatePercentage(value, total) {
        if (total === 0) return 0;
        return ((value / total) * 100).toFixed(1);
    }

    // Truncate text
    static truncateText(text, maxLength = 50) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    // Copy to clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
        }
    }

    // Generate CSV from data
    static generateCSV(data, headers) {
        const csvRows = [];
        
        // Add headers
        csvRows.push(headers.join(','));
        
        // Add data rows
        data.forEach(item => {
            const row = headers.map(header => {
                let value = item[header];
                if (typeof value === 'string') {
                    value = `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            });
            csvRows.push(row.join(','));
        });
        
        return csvRows.join('\n');
    }

    // Download file
    static downloadFile(content, filename, type = 'text/plain') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Show loading overlay
    static showLoading() {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;
            
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.style.cssText = `
                width: 60px;
                height: 60px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
            `;
            
            overlay.appendChild(spinner);
            document.body.appendChild(overlay);
        }
    }

    // Hide loading overlay
    static hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Sleep function
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get month name
    static getMonthName(monthNumber) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1] || '';
    }

    // Get current month and year
    static getCurrentMonthYear() {
        const now = new Date();
        return {
            month: now.getMonth() + 1,
            year: now.getFullYear()
        };
    }

    // Filter transactions by date range
    static filterTransactionsByDate(transactions, startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return transactions.filter(transaction => {
            const date = new Date(transaction.date);
            return date >= start && date <= end;
        });
    }
}

// Make Utils globally available
window.Utils = Utils;