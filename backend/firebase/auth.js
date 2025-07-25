const jwt = require("jsonwebtoken");
const admin = require("./firebase.js");

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Firebase token verification (returns full user object)
async function decodeAuthToken(token) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // contains email, uid, etc.
  } catch (err) {
    console.error("Firebase token verification failed:", err);
    return null;
  }
}

// ✅ Custom JWT verification (if you ever use it)
function verifyJWT(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Custom JWT verification failed:", err);
    return null;
  }
}

module.exports = { decodeAuthToken, verifyJWT };
