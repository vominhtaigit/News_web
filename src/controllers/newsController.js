import News from '../models/newsModel.js';
import Category from '../models/categoryModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { updateNewsCache } from './HomeController.js';

// Setup multer storage
 const storage = multer.diskStorage({
     destination: function(req, file, cb) {
         const uploadDir = 'public/images';
         // Create directory if it doesn't exist
         if (!fs.existsSync(uploadDir)) {
             fs.mkdirSync(uploadDir, { recursive: true });
         }
         cb(null, uploadDir);
     },
     filename: function(req, file, cb) {
         cb(null, Date.now() + path.extname(file.originalname));
     }
 });

// Create the multer instance but don't export directly
const uploadMiddleware = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Images Only!"));
    }
});


export const upload = uploadMiddleware;

export const getAllNews = async(req, res) => {
    try {
        const filter = req.user?.role === 'admin' ? {} : { disabled: { $ne: true } };
        const news = await News.find(filter)
            .populate('category')
            .populate('author')
            .sort({ createdAt: -1 }); 
        res.render('news', { news }); 
    } catch (err) {
        res.status(500).send('Error fetching news: ' + err.message);
    }
};

export const getNewsById = async (req, res) => {
    try {
        console.log('Fetching news with ID:', req.params.id);
        // Remove the disabled filter for admin users
        const news = await News.findById(req.params.id)
            .populate('category')
            .populate('author');

        if (!news) {
            console.log('News not found');
            return res.status(404).send('News not found');
        }

        // Only check disabled status after finding the news
        if (news.disabled && (!req.user || req.user.role !== 'admin')) {
            console.log('News is disabled and user is not admin');
            return res.status(404).send('News not found');
        }

        console.log('News found:', news);
        res.render('newsDetail', { news });
    } catch (err) {
        console.error('Error fetching news:', err);
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
            author: req.user._id,
            image: req.file ? `/uploads/${req.file.filename}` : null,
        });
        await news.save();

        // Cập nhật lại cache
        await updateNewsCache();

        res.redirect('/news');
    } catch (err) {
        res.status(400).send('Error creating news: ' + err.message);
    }
};

export const renderEditNewsPage = async(req, res) => {
    try {
        const news = await News.findById(req.params.id);
        const categories = await Category.find();
        if (!news) {
            return res.status(404).send('News not found');
        }
        res.render('updateNews', { news, categories });
    } catch (err) {
        res.status(500).send('Error rendering edit news form: ' + err.message);
    }
};

export const updateNews = async (req, res) => {
    const { title, content, category } = req.body;
    try {
        const updateData = {
            title,
            content,
            category,
            updatedAt: Date.now(),
        };

        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const news = await News.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!news) return res.status(404).send('News not found');

        await updateNewsCache();

        res.redirect('/admin');
    } catch (err) {
        res.status(400).send('Error updating news: ' + err.message);
    }
};

export const deleteNews = async(req, res) => {
    try {
        const news = await News.findByIdAndDelete(req.params.id);
        if (!news) return res.status(404).send('News not found');
        res.redirect('/news');
    } catch (err) {
        res.status(500).send('Error deleting news: ' + err.message);
    }
};

export const renderCreateNewsPage = async(req, res) => {
    try {
        const categories = await Category.find(); 
        res.render('createNews', { categories });
    } catch (err) {
        res.status(500).send('Error rendering create news form: ' + err.message);
    }
};

export const renderAdminPage = async(req, res) => {
    try {
        const news = await News.find().populate('category');
        const categories = await Category.find();
        res.render('admin', { news, categories });
    } catch (err) {
        res.status(500).send('Error rendering admin page: ' + err.message);
    }
};

export const getNews = async(req, res) => {
    try {
        const filter = req.user?.role === 'admin' ? {} : { disabled: { $ne: true } };
        const news = await News.find(filter)
            .populate('category')
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.render('index', {
            news,
            user: req.user,
            categories: await Category.find()
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).render('error', { message: 'Error loading news articles', error });
    }
};

export const toggleDisableNews = async(req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) return res.status(404).send('News not found');
        
        news.disabled = !news.disabled;
        await news.save();
        
        res.redirect('/admin');
    } catch (err) {
        res.status(500).send('Error toggling news status: ' + err.message);
    }
};

export const getNewsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).send('Category not found');

        const news = await News.find({ category: categoryId, disabled: { $ne: true } })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.render('newsbycategory', { category, news });
    } catch (err) {
        res.status(500).send('Error fetching news by category: ' + err.message);
    }
};