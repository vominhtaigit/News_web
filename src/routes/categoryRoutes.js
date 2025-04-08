import express from 'express';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/categoryController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route để lấy danh sách danh mục
router.get('/', getAllCategories);

// Route để tạo danh mục (chỉ dành cho admin)
router.post('/', isAuthenticated, createCategory);
// Route để hiển thị form tạo danh mục
router.get('/create', isAuthenticated, (req, res) => {
    res.render('createCategory'); // Render view 'createCategory.ejs'
});
// Route để hiển thị form sửa danh mục (chỉ dành cho admin)
router.get('/edit/:id', isAuthenticated, (req, res) => {
    const categoryId = req.params.id;
    res.render('editCategory', { categoryId }); // Render view 'editCategory.ejs' và truyền categoryId
});
router.post('/', createCategory);
// Route để xóa danh mục (chỉ dành cho admin)
router.delete('/:id', isAuthenticated, deleteCategory);

export default router;