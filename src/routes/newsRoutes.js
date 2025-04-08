import express from 'express';
import {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    renderCreateNewsPage, // Ensure this is imported
} from '../controllers/newsController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Only logged-in users can access the create news page
router.get('/create', isAuthenticated, renderCreateNewsPage);

// Route POST to handle creating news
router.post('/create', isAuthenticated, createNews);

// Route PUT/DELETE for update & delete
router.put('/:id', isAuthenticated, updateNews);
router.delete('/:id', isAuthenticated, deleteNews);

export default router;
