const { v4: uuid } = require("uuid");
const { verifyJWT } = require("../firebase/auth.js");

async function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("middleware auth header:", authHeader);

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = await verifyJWT(token); // ✅ Await here

      if (decoded && decoded.userId) {
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        console.log("✅ JWT verified. userId:", req.userId);
      } else {
        throw new Error("Invalid decoded token structure");
      }
    } catch (err) {
      console.warn("❌ JWT verification failed:", err.message);
      const userId = uuid();
      req.userId = userId;
      console.log("⚠️ Assigned new userId due to JWT error:", userId);
    }
  } else {
    // No Authorization header
    const userId = uuid();
    req.userId = userId;
    console.log("⚠️ No auth header. Assigned new userId:", userId);
  }

  console.log("➡️ Final req.userId before next():", req.userId);
  next();
}

module.exports = {
  userMiddleware,
};
