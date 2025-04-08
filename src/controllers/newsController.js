import News from '../models/newsModel.js';
import Category from '../models/categoryModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Setup multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/images';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Create the multer instance but don't export directly
const uploadMiddleware = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Images Only!"));
    }
});

// Export a wrapped version of the middleware
export const upload = uploadMiddleware;

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
            author: req.user._id, // Automatically set the author
            image: req.file ? `/images/${req.file.filename}` : null // Save image path if uploaded
        });
        await news.save();
        res.redirect('/news'); // Chuyển hướng đến danh sách tin tức
    } catch (err) {
        res.status(400).send('Error creating news: ' + err.message);
    }
};

export const renderEditNewsPage = async (req, res) => {
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
            updatedAt: Date.now()
        };

        // Add image to update data if a new file was uploaded
        if (req.file) {
            updateData.image = `/images/${req.file.filename}`;
        }

        const news = await News.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        if (!news) return res.status(404).send('News not found');
        res.redirect('/admin');
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

export const renderCreateNewsPage = async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch categories for the form
        res.render('createNews', { categories });
    } catch (err) {
        res.status(500).send('Error rendering create news form: ' + err.message);
    }
};

export const renderAdminPage = async (req, res) => {
    try {
        const news = await News.find().populate('category');
        const categories = await Category.find();
        res.render('admin', { news, categories });
    } catch (err) {
        res.status(500).send('Error rendering admin page: ' + err.message);
    }
};