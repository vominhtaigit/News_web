import express from 'express';
import upload from '../middlewares/uploadMiddleware.js'; 
import {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    renderCreateNewsPage,
    renderEditNewsPage,
    toggleDisableNews,
    getNewsByCategory,
} from '../controllers/newsController.js'; 
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { getNews } from '../controllers/newsController.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();


router.use(express.urlencoded({ extended: true }));


router.get('/create', isAuthenticated, renderCreateNewsPage);


router.post('/create', isAuthenticated, upload.single('image'), createNews);


router.get('/edit/:id', isAuthenticated, renderEditNewsPage);


router.get('/', getAllNews);


router.get('/category/:categoryId', getNewsByCategory);

router.get('/:id', getNewsById);

router.post('/update/:id', isAuthenticated, upload.single('image'), updateNews);

router.post('/:id/toggle-disable', isAuthenticated, isAdmin, toggleDisableNews);


router.delete('/:id', isAuthenticated, deleteNews);
router.get('/', getNews);

export default router;