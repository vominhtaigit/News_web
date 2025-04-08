import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import News from '../models/newsModel.js';
import {
    getAllNews,
    getNewsById,
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
router.get('/create', renderCreateNewsForm); // <-- chỉ dùng /news/create

// Route để tạo bài viết mới
router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const { title, content, category, author } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Lưu đường dẫn ảnh

        const news = new News({
            title,
            content,
            category,
            author,
            image,
        });

        await news.save();
        // Sau khi tạo thành công, chuyển hướng về trang danh sách tin tức
        res.redirect('/news');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route PUT/DELETE cho update & xóa
router.put('/:id', isAuthenticated, updateNews);
router.delete('/:id', isAuthenticated, deleteNews);

export default router;
