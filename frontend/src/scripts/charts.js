// Chart Service

class ChartService {
    constructor() {
        this.charts = new Map();
    }

    // Create income vs expense chart
    createIncomeExpenseChart(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Income', 'Expenses'],
                datasets: [{
                    data: [data.totalIncome || 0, data.totalExpense || 0],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(247, 37, 133, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(247, 37, 133, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 8,
                    spacing: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 13,
                                family: "'Inter', sans-serif"
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += Utils.formatCurrency(context.raw);
                                return label;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create category breakdown chart
    createCategoryChart(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        
        // Prepare data
        const categories = data.map(item => item.category);
        const amounts = data.map(item => item.amount);
        const colors = categories.map(cat => Utils.getCategoryColor(cat));
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Amount',
                    data: amounts,
                    backgroundColor: colors.map(color => color + 'CC'),
                    borderColor: colors,
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value);
                            },
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return Utils.formatCurrency(context.raw);
                            }
                        }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create monthly trend chart
    createMonthlyTrendChart(canvasId, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Prepare data for the current year
        const currentYear = new Date().getFullYear();
        const monthlyIncome = Array(12).fill(0);
        const monthlyExpense = Array(12).fill(0);
        
        data.forEach(transaction => {
            const date = new Date(transaction.date);
            if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                const amount = parseFloat(transaction.amount);
                
                if (transaction.type === 'income') {
                    monthlyIncome[month] += amount;
                } else {
                    monthlyExpense[month] += amount;
                }
            }
        });
        
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Income',
                        data: monthlyIncome,
                        borderColor: 'rgba(40, 167, 69, 1)',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    },
                    {
                        label: 'Expenses',
                        data: monthlyExpense,
                        borderColor: 'rgba(247, 37, 133, 1)',
                        backgroundColor: 'rgba(247, 37, 133, 0.1)',
                        tension: 0.4,
                        fill: true,
                        borderWidth: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value);
                            },
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${Utils.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create budget vs actual chart
    createBudgetChart(canvasId, budgetData, actualData) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        
        const categories = Object.keys(budgetData);
        const budgetValues = categories.map(cat => budgetData[cat]);
        const actualValues = categories.map(cat => actualData[cat] || 0);
        
        const chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [
                    {
                        label: 'Budget',
                        data: budgetValues,
                        backgroundColor: 'rgba(67, 97, 238, 0.7)',
                        borderRadius: 6
                    },
                    {
                        label: 'Actual',
                        data: actualValues,
                        backgroundColor: 'rgba(76, 201, 240, 0.7)',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return Utils.formatCurrency(value);
                            },
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${Utils.formatCurrency(context.raw)}`;
                            }
                        }
                    }
                }
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }

    // Create savings progress chart
    createSavingsChart(canvasId, goal, current) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Destroy existing chart if it exists
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
        }
        
        const percentage = (current / goal) * 100;
        
        const chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Saved', 'Remaining'],
                datasets: [{
                    data: [current, Math.max(0, goal - current)],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(233, 236, 239, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(233, 236, 239, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 8,
                    spacing: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '80%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += Utils.formatCurrency(context.raw);
                                return label;
                            }
                        }
                    }
                }
            }
        });
        
        // Add center text
        Chart.register({
            id: 'centerText',
            afterDraw: function(chart) {
                const width = chart.width;
                const height = chart.height;
                const ctx = chart.ctx;
                
                ctx.restore();
                const fontSize = (height / 150).toFixed(2);
                ctx.font = `${fontSize}em Inter`;
                ctx.textBaseline = 'middle';
                
                const text = `${percentage.toFixed(1)}%`;
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
                
                ctx.fillStyle = '#212529';
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        });
        
        this.charts.set(canvasId, chart);
        return chart;
    }

    // Destroy all charts
    destroyAllCharts() {
        this.charts.forEach(chart => {
            chart.destroy();
        });
        this.charts.clear();
    }

    // Destroy specific chart
    destroyChart(canvasId) {
        if (this.charts.has(canvasId)) {
            this.charts.get(canvasId).destroy();
            this.charts.delete(canvasId);
        }
    }

    // Update chart data
    updateChart(canvasId, newData) {
        if (this.charts.has(canvasId)) {
            const chart = this.charts.get(canvasId);
            chart.data = newData;
            chart.update();
        }
    }
}

// Create global chart service instance
window.chartService = new ChartService();