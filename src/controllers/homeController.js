import Category from '../models/categoryModel.js';
import News from '../models/newsModel.js';

export const renderHomePage = async (req, res) => {
    try {
        const categories = await Category.find();
        const news = await News.find().sort({ createdAt: -1 }).limit(10);
        res.render('index', {
            categories,
            news,
            user: req.user || null,// Pass the logged-in user to the view
        });
    } catch (err) {
        res.status(500).send('Error loading home page: ' + err.message);
    }
};