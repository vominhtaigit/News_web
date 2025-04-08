import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';
import passport from '../config/passportConfig.js'; // Corrected path
import { renderHomePage } from './controllers/HomeController.js'; // Corrected path
// Load environment variables
dotenv.config();

// Entry point for the News Web Project

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/webtintuc';

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware cho session
app.use(
    session({
        secret: 'your_secret_key', // Thay bằng secret key của bạn
        resave: false,
        saveUninitialized: false,
    })
);

// Middleware cho Passport
app.use(passport.initialize());
app.use(passport.session());

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', './src/views'); // Đường dẫn tới thư mục views

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
    });

// Route for home page
app.get('/', renderHomePage); // Sử dụng HomeController để render index.ejs

// Route to render create news form
app.get('/createNews', async (req, res) => {
    try {
        const categories = await Category.find(); // Lấy danh sách danh mục
        res.render('createNews', { categories }); // Render view 'createNews.ejs'
    } catch (err) {
        res.status(500).send('Error rendering create news form: ' + err.message);
    }
});

// Kết nối route tin tức
app.use('/news', newsRoutes);

// Kết nối route danh mục
app.use('/categories', categoryRoutes);

// Kết nối route auth
app.use('/auth', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});