import express from 'express';
import { UserController } from '../controllers/userController.js';

const router = express.Router();

// Rutas públicas
router.post('/register', UserController.register);
router.post('/verify-email', UserController.verifyEmail);
router.post('/login', UserController.login);
router.post('/resend-verification', UserController.resendVerificationCode);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

// Rutas protegidas
router.get('/profile', UserController.authenticateToken, UserController.getProfile);
router.put('/profile', UserController.authenticateToken, UserController.updateProfile);
router.put('/change-password', UserController.authenticateToken, UserController.changePassword);
router.delete('/account', UserController.authenticateToken, UserController.deleteAccount);

// Rutas de administración (requieren token + role=admin)
router.get('/admin', UserController.authenticateToken, UserController.authorizeAdmin, UserController.listUsers);
router.get('/admin/:id', UserController.authenticateToken, UserController.authorizeAdmin, UserController.getUserById);
router.post('/admin', UserController.authenticateToken, UserController.authorizeAdmin, UserController.adminCreateUser);
router.put('/admin/:id', UserController.authenticateToken, UserController.authorizeAdmin, UserController.adminUpdateUser);
router.delete('/admin/:id', UserController.authenticateToken, UserController.authorizeAdmin, UserController.adminDeleteUser);

export default router;