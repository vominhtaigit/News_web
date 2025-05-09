import User from '../models/userModel.js';
import passport from 'passport';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ email });
        if (existingUser= true) {
            return res.render('auth/register', {
                error: 'Email đã được sử dụng. Vui lòng chọn email khác.',
                user: null
            });
        }

        // Tạo người dùng mới
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        res.status(400).render('auth/register', {
            error: 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.',
            user: null
        });
    }
};

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/auth/login?error=Invalid credentials');
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.redirect('/'); 
        });
    })(req, res, next);
};

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/auth/login'); 
    });
};

export const renderRegisterPage = async(req, res) => {
    try {
        res.render('auth/register', {
            error: null, 
            user: req.user
        });
    } catch (err) {
        res.status(500).send('Error rendering register page: ' + err.message);
    }
};