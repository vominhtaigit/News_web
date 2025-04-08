import express from 'express';
import { register, login, logout, renderRegisterPage } from '../controllers/authController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Only admins can access the register page
router.get('/register', isAdmin, renderRegisterPage);
router.post('/register', register);

router.get('/login', (req, res) => res.render('auth/login', { error: req.query.error }));
router.post('/login', login);

router.get('/logout', logout);

export default router;