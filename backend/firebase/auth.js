const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // fallback for dev

// ✅ Custom JWT verification
function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}

// ✅ Custom JWT generation
function generateJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

module.exports = {
  verifyJWT,
  generateJWT,
};
