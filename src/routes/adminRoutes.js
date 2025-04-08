import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import { renderAdminPage } from '../controllers/newsController.js';

const router = express.Router();

// Main admin dashboard route
router.get('/', isAuthenticated, isAdmin, renderAdminPage);

export default router;
