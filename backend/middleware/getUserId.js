const { v4: uuid } = require("uuid");
const { verifyJWT } = require("../firebase/auth.js");

async function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("middleware auth header", authHeader);

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);

    if (decoded && decoded.userId) {
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      console.log("JWT verified, userId:", req.userId);
    } else {
      // Invalid JWT token
      const userId = uuid();
      req.userId = userId;
      console.log("Invalid JWT, generated new userId:", userId);
    }
  } else {
    // No authorization header
    const userId = uuid();
    req.userId = userId;
    console.log("No auth header, generated new userId:", userId);
  }

  next();
}

module.exports = {
  userMiddleware,
};
