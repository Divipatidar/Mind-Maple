// firebase/auth.js
const jwt = require("jsonwebtoken");
const admin = require("./firebase.js").default;

const JWT_SECRET = process.env.JWT_SECRET;

// Firebase token verification
async function decodeAuthToken(token) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.email;
  } catch (err) {
    return null; // fallback to JWT
  }
}

// Custom JWT verification
function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// ✅ Export both as named functions
module.exports = { decodeAuthToken, verifyJWT };
