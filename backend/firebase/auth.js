const admin = require("./firebase.js").default;
const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

async function decodeAuthToken(token) {
  try {
    // Handle different token formats
    let firebaseToken = token;
    
    // If token has "Bearer " prefix, remove it
    if (token && token.startsWith("Bearer ")) {
      firebaseToken = token.split(" ")[1];
    }
    // If token has space but no "Bearer", take the second part
    else if (token && token.includes(" ")) {
      firebaseToken = token.split(" ")[1];
    }
    
    console.log("Processing token:", firebaseToken ? "Token present" : "No token");
    
    if (!firebaseToken) {
      throw new Error("No token provided");
    }
    
    const decodedValue = await admin.auth().verifyIdToken(firebaseToken);
    const email = decodedValue.email;
    
    console.log("Successfully decoded email:", email);
    return email;
    
  } catch (error) {
    console.error("Token decode error:", error.message);
    return null; // Return null instead of undefined
  }
}

function generateJWT(payload) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "14d" });
}

function verifyJWT(token) {
  try {
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log("JWT verification error:", error.message);
    return null;
  }
}

module.exports = { decodeAuthToken, generateJWT, verifyJWT };