import User from '../models/userModel.js';
import passport from 'passport';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        res.status(400).send('Error registering user: ' + err.message);
    }
};

export const login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
});

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.redirect('/');
    });
};