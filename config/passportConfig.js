import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../src/models/userModel.js'; 

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user || !(await user.comparePassword(password))) {
                return done(null, false, { message: 'Invalid email or password' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email is already registered');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Redirect to login page
        res.redirect('/auth/login');
    } catch (err) {
        res.status(400).send('Error registering user: ' + err.message);
    }
};

export default passport;