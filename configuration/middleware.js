// middlewares/verifyToken.js
const jwt = require("jsonwebtoken");

// Access token secret used during generation
const ACCESS_SECRET = "9876@#%@##!#"; // Use .env in production

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    req.user = decoded; // attaches { id: userId, iat, exp }
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;

