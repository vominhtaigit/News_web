import User from '../models/userModel.js';
import passport from 'passport';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/auth/login'); // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
    } catch (err) {
        res.status(400).send('Error registering user: ' + err.message);
    }
};

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/auth/login?error=Invalid credentials');
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.redirect('/'); // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
        });
    })(req, res, next);
};

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/auth/login'); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
    });
};

export const renderRegisterPage = (req, res) => {
    res.render('auth/register', { user: req.user }); // Adjust path to match the file location
};