import express from 'express';
import {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    renderCreateNewsForm,
} from '../controllers/newsController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/:id', getNewsById);

// Route GET để hiển thị form tạo tin
router.get('/create',  renderCreateNewsForm); // <-- chỉ dùng /news/create

// Route POST để xử lý tạo tin mới
router.post('/create',  createNews);

// Route PUT/DELETE cho update & xóa
router.put('/:id', isAuthenticated, updateNews);
router.delete('/:id', isAuthenticated, deleteNews);

export default router;
