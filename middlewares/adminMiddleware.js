// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    if (req.session.user.role !== 'admin') {
        return res.redirect('/dashboard');
    }
    next();
};

module.exports = adminMiddleware;