import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Import hàm fileURLToPath từ 'url'
import newsRoutes from './routes/newsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import News from './models/newsModel.js'; // Đảm bảo bạn đã import model News

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // Add admin routes import
import userRoutes from './routes/userRoutes.js'; // Add user routes import
import session from 'express-session';
import passport from '../config/passportConfig.js'; // Corrected path
import { renderHomePage } from './controllers/HomeController.js'; // Corrected path
import Category from './models/categoryModel.js'; // Add this import
import { globalVariables } from './middlewares/globalVariables.js';

// Load environment variables
dotenv.config();

// Định nghĩa __filename và __dirname trong ES module
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Entry point for the News Web Project
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/webtintuc';

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './src/views'); // Đường dẫn tới thư mục views

// Serve static files from public directory 
app.use(express.static('public'));
app.use('/images', express.static('public/images'));

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware for session
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(globalVariables);
app.use('/news', newsRoutes);
app.use('/categories', categoryRoutes);
// Kết nối với MongoDB
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
app.get('/', renderHomePage);

// Connect routes
app.use('/news', newsRoutes);
app.use('/categories', categoryRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});