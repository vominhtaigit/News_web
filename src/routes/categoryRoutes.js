import express from 'express';
import { getAllCategories, createCategory, deleteCategory, renderCreateCategoryPage } from '../controllers/categoryController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Route để lấy danh sách danh mục
router.get('/', getAllCategories);

// Route để tạo danh mục (chỉ dành cho admin)
router.post('/create', isAuthenticated, isAdmin, createCategory);

// Only logged-in users can access the create category page
router.get('/create', isAuthenticated, renderCreateCategoryPage);

// Route để hiển thị form sửa danh mục (chỉ dành cho admin)
router.get('/edit/:id', isAuthenticated, isAdmin, (req, res) => {
    const categoryId = req.params.id;
    res.render('editCategory', { categoryId }); // Render view 'editCategory.ejs' và truyền categoryId
});

// Route để xóa danh mục (chỉ dành cho admin)
router.delete('/:id', isAuthenticated, isAdmin, deleteCategory);

export default router;