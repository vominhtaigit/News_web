import News from '../models/newsModel.js';
import Category from '../models/categoryModel.js';

export const getAllNews = async (req, res) => {
    try {
        const news = await News.find().populate('category'); // Bỏ populate('author')
        res.render('news', { news }); // Render view 'news.ejs'
    } catch (err) {
        res.status(500).send('Error fetching news: ' + err.message);
    }
};

export const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id).populate('category').populate('author');
        if (!news) return res.status(404).send('News not found');
        res.render('newsDetail', { news });
    } catch (err) {
        res.status(500).send('Error fetching news: ' + err.message);
    }
};

export const createNews = async (req, res) => {
    const { title, content, category } = req.body;
    try {
        const news = new News({
            title,
            content,
            category,
            author: null, // Tạm thời để null
        });
        await news.save();
        res.redirect('/news'); // Chuyển hướng đến danh sách tin tức
    } catch (err) {
        res.status(400).send('Error creating news: ' + err.message);
    }
};

export const updateNews = async (req, res) => {
    const { title, content, category } = req.body;
    try {
        const news = await News.findByIdAndUpdate(
            req.params.id,
            { title, content, category, updatedAt: Date.now() },
            { new: true }
        );
        if (!news) return res.status(404).send('News not found');
        res.redirect('/news');
    } catch (err) {
        res.status(400).send('Error updating news: ' + err.message);
    }
};

export const deleteNews = async (req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).send('News not found');
        res.redirect('/news');
    } catch (err) {
        res.status(500).send('Error deleting news: ' + err.message);
    }
};

export const renderCreateNewsForm = async (req, res) => {
    try {
        const categories = await Category.find(); // Lấy danh sách danh mục
        res.render('createNews', { categories }); // Render view 'createNews.ejs'
    } catch (err) {
        res.status(500).send('Error rendering create news form: ' + err.message);
    }
};