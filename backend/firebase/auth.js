const admin = require("./firebase.js").default;
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

async function decodeAuthToken(token) {
  try {
    const Id = token?.split(" ")[1];
    console.log("em:", Id);
    const decodedValue = await admin.auth().verifyIdToken(Id);
    const email = decodedValue.email;
    console.log("@@", email);
    return email;
  } catch (error) {
    console.log(error.message);
  }
}

function generateJWT(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "14d" });
}

function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return null;
  }
}

module.exports = { decodeAuthToken, generateJWT, verifyJWT };
