import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';  // Import hàm fileURLToPath từ 'url'
import newsRoutes from './routes/newsRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import Category from './models/categoryModel.js';

// Load environment variables
dotenv.config();

// Định nghĩa __filename và __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Entry point for the News Web Project
const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/webtintuc';

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Phục vụ ảnh tĩnh trong thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Các route
app.use('/news', newsRoutes);
app.use('/api/news', newsRoutes);

// Set view engine và views directory
app.set('view engine', 'ejs');
app.set('views', './src/views'); // Đường dẫn tới thư mục views

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

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the News Web Project!');
});

// Route để render create news form
app.get('/createNews', async (req, res) => {
    try {
        const categories = await Category.find(); // Lấy danh sách danh mục
        res.render('createNews', { categories }); // Render view 'createNews.ejs'
    } catch (err) {
        res.status(500).send('Error rendering create news form: ' + err.message);
    }
});

// Kết nối route
app.use('/', newsRoutes);
app.use('/categories', categoryRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
