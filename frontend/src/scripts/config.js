// API Configuration
const API_CONFIG = {
    BASE_URL: '/api/v1',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            PROFILE: '/auth/profile'
        },
        TRANSACTIONS: {
            LIST: '/transactions',
            CREATE: '/transactions',
            UPDATE: '/transactions/:id',
            DELETE: '/transactions/:id',
            STATS: '/transactions/stats',
            CATEGORIES: '/transactions/categories'
        },
        REPORTS: {
            GENERATE: '/reports/generate',
            DOWNLOAD: '/reports/download'
        }
    },
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
};

// App Configuration
const APP_CONFIG = {
    APP_NAME: 'FinTrack',
    VERSION: '1.0.0',
    CURRENCY: 'USD',
    DATE_FORMAT: 'MM/DD/YYYY',
    ITEMS_PER_PAGE: 10,
    SESSION_TIMEOUT: 30 // minutes
};

// Demo Data Configuration
const DEMO_CONFIG = {
    USERS: [
        {
            id: 1,
            email: 'admin@fintrack.com',
            password: 'password123',
            name: 'Admin User',
            avatar: 'AU',
            role: 'admin'
        },
        {
            id: 2,
            email: 'john@example.com',
            password: 'password123',
            name: 'John Doe',
            avatar: 'JD',
            role: 'user'
        },
        {
            id: 3,
            email: 'jane@example.com',
            password: 'password123',
            name: 'Jane Smith',
            avatar: 'JS',
            role: 'user'
        }
    ],
    TRANSACTION_CATEGORIES: {
        income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
        expense: ['Food & Dining', 'Shopping', 'Transportation', 'Entertainment', 
                 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other']
    },
    CURRENCIES: [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
    ]
};

// Export configuration
window.API_CONFIG = API_CONFIG;
window.APP_CONFIG = APP_CONFIG;
window.DEMO_CONFIG = DEMO_CONFIG;