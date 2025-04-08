import express from 'express';
import {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    renderCreateNewsPage,
    upload,
} from '../controllers/newsController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply middlewares in correct order
router.use(express.urlencoded({ extended: true }));

// Route for rendering create news page (must come before /:id route)
router.get('/create', isAuthenticated, renderCreateNewsPage);

// Create news routes (must come before /:id route)
router.post('/create', isAuthenticated, upload.single('image'), createNews);

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Update & delete routes
router.put('/:id', isAuthenticated, updateNews);
router.delete('/:id', isAuthenticated, deleteNews);

export default router;
