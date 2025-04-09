import Category from '../models/categoryModel.js';
import News from '../models/newsModel.js';
import Fuse from 'fuse.js';

let cachedNews = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

export const updateNewsCache = async () => {
    try {
        cachedNews = await News.find().sort({ createdAt: -1 }).limit(11); // Lấy 10 tin mới nhất
        cacheTimestamp = Date.now(); // Cập nhật thời gian cache
        console.log('[Cache] Cache đã được cập nhật.');
    } catch (err) {
        console.error('[Error] Không thể cập nhật cache:', err.message);
    }
};

export const renderHomePage = async (req, res) => {
    const q = req.query.q;
    try {
        const categories = await Category.find();

        const now = Date.now();
        let news;

        console.time('🕒 News Query Time');

        if (!cachedNews || now - cacheTimestamp > CACHE_DURATION) {
            await updateNewsCache();
        } else {
            console.log('[Cache] Tin tức từ CACHE.');
        }

        news = cachedNews;

        console.timeEnd('🕒 News Query Time');

        if (q) {
            const keywords = q.split(' ');
            const options = {
                keys: ['title', 'content'],
                threshold: 0.2,
                includeScore: true,
            };

            const fuse = new Fuse(news, options);
            let results = [];

            keywords.forEach(keyword => {
                const result = fuse.search(keyword);
                results = [...results, ...result];
            });

            const uniqueResults = Array.from(new Set(results.map(item => item.item._id)))
                .map(id => results.find(item => item.item._id === id).item);

            news = uniqueResults;
        }

        res.render('index', {
            categories,
            news,
            user: req.user || null,
            q,
        });

    } catch (err) {
        console.error('[Error] Home page render failed:', err);
        res.status(500).send('Error loading home page: ' + err.message);
    }
};
