async function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  let token = authHeader.replace("Bearer ", "");

  // First try Firebase token
  const firebaseDecoded = await decodeAuthToken(token);
  if (firebaseDecoded) {
    req.user = { email: firebaseDecoded, authSource: "firebase" };
    return next();
  }

  // If not a Firebase token, try custom JWT
  const jwtDecoded = verifyJWT(token);
  if (jwtDecoded) {
    req.user = { ...jwtDecoded, authSource: "custom" };
    return next();
  }

  // If neither works
  return res.status(401).json({ error: "Invalid or expired token" });
}
