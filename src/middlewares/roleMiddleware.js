function roleMiddleware(requiredRole) {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole) {
            return res.status(401).json({ message: 'Unauthorized: No role found' });
        }

        if (userRole !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        next();
    };
}

export const isAdmin = (req, res, next) => {
    console.log('Checking admin role:', req.user);
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/auth/login');
};

export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login'); // Redirect to login if not authenticated
};

export default roleMiddleware;