// Fake auth controller for GitHub display

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthController {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            
            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'User already exists'
                });
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create user
            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                avatar: name.split(' ').map(n => n[0]).join('')
            });
            
            // Generate token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            // Remove password from response
            user.password = undefined;
            
            res.status(201).json({
                success: true,
                data: {
                    user,
                    token
                },
                message: 'Registration successful'
            });
        } catch (error) {
            next(error);
        }
    }
    
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            
            // Find user
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
            
            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }
            
            // Generate token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );
            
            // Remove password from response
            user.password = undefined;
            
            res.json({
                success: true,
                data: {
                    user,
                    token
                },
                message: 'Login successful'
            });
        } catch (error) {
            next(error);
        }
    }
    
    async logout(req, res, next) {
        try {
            // In a real app, you might want to blacklist the token
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        } catch (error) {
            next(error);
        }
    }
    
    async getProfile(req, res, next) {
        try {
            const user = await User.findById(req.user.userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            
            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    }
    
    async updateProfile(req, res, next) {
        try {
            const updates = req.body;
            
            // Remove restricted fields
            delete updates.password;
            delete updates.role;
            
            // Update user
            const user = await User.findByIdAndUpdate(
                req.user.userId,
                updates,
                { new: true, runValidators: true }
            );
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }
            
            res.json({
                success: true,
                data: user,
                message: 'Profile updated successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();