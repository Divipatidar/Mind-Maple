const { decodeAuthToken } = require("../firebase/auth.js");

async function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("middleware auth header", authHeader);

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = await decodeAuthToken(token); // ✅ async call

    if (decoded && decoded.uid) {
      req.userId = decoded.uid;
      req.userEmail = decoded.email;
      console.log("JWT verified, userId:", req.userId);
      return next();
    } else {
      console.log("Invalid JWT");
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    console.log("No auth header");
    return res.status(401).json({ error: "No token provided" });
  }
}

module.exports = {
  userMiddleware,
};
