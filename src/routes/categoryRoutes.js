import express from 'express';
import { getAllCategories, createCategory, deleteCategory, renderCreateCategoryPage, updateCategory, renderEditCategoryPage } from '../controllers/categoryController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';
import News from '../models/newsModel.js';
import Category from '../models/categoryModel.js';

const router = express.Router();


router.get('/', getAllCategories);


router.post('/create', isAuthenticated, isAdmin, createCategory);


router.get('/create', isAuthenticated, renderCreateCategoryPage);


router.get('/edit/:id', isAuthenticated, isAdmin, renderEditCategoryPage);

router.delete('/:id', isAuthenticated, isAdmin, deleteCategory);

router.post('/update/:id', isAuthenticated, isAdmin, updateCategory);

export default router;