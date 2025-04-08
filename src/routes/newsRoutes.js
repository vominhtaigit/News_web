import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import News from '../models/newsModel.js';
import {
    getAllNews,
    getNewsById,
    updateNews,
    deleteNews,
    renderCreateNewsPage,
    renderEditNewsPage,
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

// Route for editing news (must come before /:id route)
router.get('/edit/:id', isAuthenticated, renderEditNewsPage);

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);


// Update route should use POST instead of PUT for form submission
router.post('/update/:id', isAuthenticated, upload.single('image'), updateNews);

// Delete route

router.delete('/:id', isAuthenticated, deleteNews);

export default router;
