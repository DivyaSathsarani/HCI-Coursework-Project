const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "furnish-dev-secret-change-in-production";
const ADMIN_USER = { id: "admin-user", email: "admin@gmail.com", name: "Admin" };
const CUSTOMER_USER = { id: "customer-user", email: "test@gmail.com", name: "Customer" };

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware, ADMIN_USER, CUSTOMER_USER };
