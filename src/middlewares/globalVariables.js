import Category from '../models/categoryModel.js';

export const globalVariables = async(req, res, next) => {
    try {
        res.locals.categories = await Category.find();
        res.locals.user = req.user || null;
        next();
    } catch (error) {
        console.error('Error loading global variables:', error);
        next(error);
    }
};