import Category from '../models/categoryModel.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('categories', { categories });
    } catch (err) {
        res.status(500).send('Error fetching categories: ' + err.message);
    }
};

export const createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = new Category({ name, description });
        await category.save();
        res.redirect('/categories'); // Chuyển hướng đến danh sách categories
    } catch (err) {
        res.status(400).send('Error creating category: ' + err.message);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).send('Category not found');
        res.redirect('/categories');
    } catch (err) {
        res.status(500).send('Error deleting category: ' + err.message);
    }
};
export const renderCreateCategoryForm = (req, res) => {
    res.render('createCategories'); // Render view 'createCategories.ejs'
};