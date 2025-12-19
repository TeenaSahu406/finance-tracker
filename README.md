# FinTrack - Personal Finance Tracker

A complete personal finance management application built with modern web technologies. Track your income, expenses, set budgets, and analyze your financial health with beautiful visualizations.

## 🚀 Live Demo

https://finance-tracker-by-teena.netlify.app

**Demo Credentials:**
- **Email:** `admin@fintrack.com`
- **Password:** `password123`

## ✨ Features

### 📊 **Financial Tracking**
- **Income/Expense Management**: Add, edit, and delete transactions
- **Category System**: Organized spending with customizable categories
- **Multi-Currency Support**: USD, EUR, GBP, JPY
- **Date Filtering**: View transactions by day, week, month, or custom range

### 📈 **Analytics & Visualization**
- **Interactive Dashboard**: Real-time financial overview
- **Chart Visualizations**: Pie charts, bar graphs, and line charts
- **Category Breakdown**: See where your money goes
- **Monthly Trends**: Track spending patterns over time

### 📄 **Reports & Export**
- **PDF Reports**: Professional financial summaries
- **CSV Export**: Download transaction history
- **Custom Reports**: Generate by date range and category
- **Report History**: Access previous reports

### 🔐 **Security & User Management**
- **Secure Authentication**: JWT-based login system
- **User Profiles**: Personalize your experience
- **Data Privacy**: Your financial data stays private
- **Session Management**: Automatic logout for security

## 🛠️ Tech Stack

**Frontend:**
- React.js (with hooks and context)
- Chart.js for data visualization
- jsPDF for PDF generation
- CSS3 with modern features (Grid, Flexbox, Variables)
- Font Awesome icons

**Backend:**
- Node.js with Express.js
- MongoDB for data storage
- JWT for authentication
- RESTful API architecture

## 📁 Project Structure

```
fintrack/
├── frontend/                 # React application
│   ├── public/              # Static files
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # CSS modules
│   │   └── services/       # API services
│   └── package.json        # Dependencies
│
├── backend/                 # Node.js API
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Entry point
│
└── README.md              # Documentation
```

## 🔧 Installation

### Option 1: Quick Start (All Files Included)

1. **Download** all files
2. **Open** `index.html` in your browser
3. **Start using** FinTrack immediately

### Option 2: Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/fintrack.git
cd fintrack

# Install dependencies
npm install

# Start development server
npm start

# Open http://localhost:3000 in browser
```

### Option 3: Docker

```bash
# Build and run with Docker
docker-compose up --build

# Access at http://localhost:3000
```

## 📱 How to Use

### 1. Getting Started
- Register a new account or use demo credentials
- Add your first transaction (income or expense)
- Set up categories that match your spending habits

### 2. Tracking Finances
- **Add Transactions**: Click "+ Add Transaction" on dashboard
- **Categorize**: Assign each transaction to a category
- **Review**: Check your dashboard for insights
- **Adjust**: Edit transactions as needed

### 3. Analyzing Data
- View **Income vs Expenses** chart
- Check **Category Breakdown** for spending patterns
- Use **Monthly Trends** to identify habits
- Set and track **Budget Goals**

### 4. Generating Reports
- Go to **Reports** page
- Select date range and report type
- Choose format (PDF/CSV)
- Generate and download

## 🔐 Security Features

- **Encrypted Passwords**: Using bcrypt hashing
- **JWT Tokens**: Secure session management
- **Input Validation**: Client and server-side validation
- **CORS Protection**: Restrict unauthorized access
- **Rate Limiting**: Prevent brute force attacks

## 📊 Data Management

Your data is stored securely and you can:
- **Export All Data**: Download complete transaction history
- **Backup Regularly**: Automatic backups option
- **Import Data**: Migrate from other systems
- **Clear Data**: Reset your account if needed

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 60+     | ✅ Full support |
| Firefox | 55+     | ✅ Full support |
| Safari  | 11+     | ✅ Full support |
| Edge    | 79+     | ✅ Full support |



## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Write tests for new features
- Update documentation

## 🐛 Reporting Issues

Found a bug? Please report it:

1. Check existing issues first
2. Use the issue template
3. Include steps to reproduce
4. Add screenshots if possible
5. Specify browser and OS

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualizations
- **jsPDF** for client-side PDF generation
- **Font Awesome** for icons
- All contributors and testers

