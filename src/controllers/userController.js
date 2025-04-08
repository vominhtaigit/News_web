import User from '../models/userModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (err) {
        res.status(500).send('Error fetching users: ' + err.message);
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.render('userDetail', { user });
    } catch (err) {
        res.status(500).send('Error fetching user: ' + err.message);
    }
};

export const updateUser = async (req, res) => {
    const { username, email, role } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { username, email, role },
            { new: true }
        );
        if (!user) return res.status(404).send('User not found');
        res.redirect('/users');
    } catch (err) {
        res.status(400).send('Error updating user: ' + err.message);
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('User not found');
        res.redirect('/users');
    } catch (err) {
        res.status(500).send('Error deleting user: ' + err.message);
    }
};