const adminCheck = (req, res, next) => {
    if (!req.user || req.user.is_admin !== true) {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
};

export default adminCheck;
