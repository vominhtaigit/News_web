import Category from '../models/categoryModel.js'; // Adjust path if necessary

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
        res.redirect('/categories');
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

export const updateCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, updatedAt: Date.now() },
            { new: true }
        );
        if (!category) return res.status(404).send('Category not found');
        res.redirect('/admin'); // Redirect back to admin page after update
    } catch (err) {
        res.status(400).send('Error updating category: ' + err.message);
    }
};

export const renderCreateCategoryPage = (req, res) => {
    res.render('createCategories', { user: req.user });
};

export const renderCreateNewsPage = async (req, res) => {
    try {
        console.log(Category); // Check if Category is defined
        const categories = await Category.find(); // Fetch categories for the form
        res.render('createNews', { categories, user: req.user });
    } catch (err) {
        res.status(500).send('Error rendering create news form: ' + err.message);
    }
};

export const renderEditCategoryPage = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }
        res.render('updateCategory', { category }); // Change from editCategory to updateCategory
    } catch (err) {
        res.status(500).send('Error fetching category: ' + err.message);
    }
};