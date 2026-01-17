const jwt = require("jsonwebtoken");
const JWT_SECRET = "1f3245d266afccd2aa0a441f41f39f6e3a50a1d7332cdc96bda7720c65e93849";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access token required" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken, JWT_SECRET };
