const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "secret";

exports.requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "No user" });
  if (req.user.role !== role)
    return res.status(403).json({ message: "Forbidden" });
  next();
};
