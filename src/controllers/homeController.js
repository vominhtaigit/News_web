import Category from '../models/categoryModel.js';
import News from '../models/newsModel.js';
import Fuse from 'fuse.js';

export const renderHomePage = async (req, res) => {
    const q = req.query.q; // Lấy từ khóa tìm kiếm từ query string
    try {
        const categories = await Category.find();
        let news = await News.find().sort({ createdAt: -1 }); // Lấy tất cả bài viết

        if (q) {
            // Tách từ khóa thành các từ riêng lẻ
            const keywords = q.split(' ');

            // Cấu hình Fuse.js
            const options = {
                keys: ['title', 'content'], // Tìm kiếm theo tiêu đề và nội dung
                threshold: 0.4, // Độ chính xác (càng thấp càng chính xác)
                includeScore: true, // Bao gồm điểm số trong kết quả
            };

            const fuse = new Fuse(news, options); // Khởi tạo Fuse.js với dữ liệu bài viết
            let results = [];

            // Tìm kiếm từng từ khóa và hợp nhất kết quả
            keywords.forEach(keyword => {
                const result = fuse.search(keyword);
                results = [...results, ...result];
            });

            // Loại bỏ các kết quả trùng lặp
            const uniqueResults = Array.from(new Set(results.map(item => item.item._id)))
                .map(id => results.find(item => item.item._id === id).item);

            news = uniqueResults; // Gán kết quả tìm kiếm vào danh sách bài viết
        }

        res.render('index', {
            categories,
            news,
            user: req.user || null,
            q, // Truyền từ khóa tìm kiếm vào view
        });
    } catch (err) {
        res.status(500).send('Error loading home page: ' + err.message);
    }
};