import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

export default authMiddleware;

// Middleware giả để bỏ qua kiểm tra đăng nhập
export const isAuthenticated = (req, res, next) => {
    console.log('isAuthenticated middleware called');
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login'); // Redirect to login if not authenticated
};