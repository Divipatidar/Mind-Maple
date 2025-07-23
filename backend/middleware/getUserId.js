const { v4: uuid } = require("uuid");
const { verifyJWT } = require("../firebase/auth.js");

async function userMiddleware(req, res, next) {
  let token;

  // 🔍 First check cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("Token from cookie");
  }
  // 🔍 Then fallback to Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token from Authorization header");
  }

  // ✅ If token found, verify it
  if (token) {
    const decoded = verifyJWT(token); // make sure verifyJWT handles invalid tokens gracefully

    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      console.log("JWT verified, userId:", req.userId);
      return next();
    }

    console.log("Invalid token, will assign new userId");
  }

  // ❌ No valid token, generate a guest userId
  const userId = uuid();
  req.userId = userId;
  console.log("Guest user created with userId:", userId);

  return next();
}

module.exports = {
  userMiddleware,
};
