const { verifyJWT } = require("../firebase/auth.js");

async function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("🔐 Middleware auth header:", authHeader);

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      console.log("✅ Valid JWT. userId:", req.userId);
      return next();
    } else {
      console.warn("❌ Invalid JWT token.");
    }
  } else {
    console.warn("❌ Missing Authorization header.");
  }

  // ❌ Reject request (strict mode)
  return res.status(401).json({ message: "Unauthorized: Invalid or missing token" });
}

module.exports = {
  userMiddleware,
};
