// Authentication Service

class AuthService {
    constructor() {
        this.api = window.apiService;
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        // Check if user is already logged in
        const token = localStorage.getItem('fintrack_token');
        const user = JSON.parse(localStorage.getItem('fintrack_user') || 'null');
        
        if (token && user) {
            this.currentUser = user;
            this.isAuthenticated = true;
        }
    }

    async login(email, password) {
        try {
            Utils.showLoading();
            
            const response = await this.api.login(email, password);
            
            if (response.success) {
                this.currentUser = response.data.user;
                this.isAuthenticated = true;
                
                // Show success message
                this.showNotification('Login successful!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.hash = '#/dashboard';
                }, 1000);
                
                return response;
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error) {
            this.showNotification(error.message || 'Login failed', 'error');
            throw error;
        } finally {
            Utils.hideLoading();
        }
    }

    async register(userData) {
        try {
            Utils.showLoading();
            
            // Validate input
            if (!userData.name || !userData.email || !userData.password) {
                throw new Error('All fields are required');
            }
            
            if (!Utils.validateEmail(userData.email)) {
                throw new Error('Please enter a valid email address');
            }
            
            if (!Utils.validatePassword(userData.password)) {
                throw new Error('Password must be at least 6 characters long');
            }
            
            if (userData.password !== userData.confirmPassword) {
                throw new Error('Passwords do not match');
            }
            
            const response = await this.api.register({
                name: userData.name,
                email: userData.email,
                password: userData.password
            });
            
            if (response.success) {
                this.currentUser = response.data.user;
                this.isAuthenticated = true;
                
                this.showNotification('Registration successful! Welcome to FinTrack.', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.hash = '#/dashboard';
                }, 1000);
                
                return response;
            } else {
                throw new Error(response.error || 'Registration failed');
            }
        } catch (error) {
            this.showNotification(error.message || 'Registration failed', 'error');
            throw error;
        } finally {
            Utils.hideLoading();
        }
    }

    async logout() {
        try {
            Utils.showLoading();
            
            await this.api.logout();
            
            this.currentUser = null;
            this.isAuthenticated = false;
            
            this.showNotification('Logged out successfully', 'info');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.hash = '#/login';
            }, 1000);
            
        } catch (error) {
            this.showNotification(error.message || 'Logout failed', 'error');
            throw error;
        } finally {
            Utils.hideLoading();
        }
    }

    async updateProfile(userData) {
        try {
            Utils.showLoading();
            
            const response = await this.api.updateProfile(userData);
            
            if (response.success) {
                this.currentUser = response.data;
                
                // Update localStorage
                localStorage.setItem('fintrack_user', JSON.stringify(this.currentUser));
                
                this.showNotification('Profile updated successfully!', 'success');
                
                return response;
            } else {
                throw new Error(response.error || 'Profile update failed');
            }
        } catch (error) {
            this.showNotification(error.message || 'Profile update failed', 'error');
            throw error;
        } finally {
            Utils.hideLoading();
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    checkAuth() {
        return this.isAuthenticated;
    }

    requireAuth() {
        if (!this.isAuthenticated) {
            window.location.hash = '#/login';
            return false;
        }
        return true;
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        const container = document.getElementById('toast-container') || (() => {
            const div = document.createElement('div');
            div.id = 'toast-container';
            div.className = 'toast-container';
            document.body.appendChild(div);
            return div;
        })();
        
        container.appendChild(toast);
        
        // Add close event
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.remove();
        });
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Create global auth service instance
window.authService = new AuthService();