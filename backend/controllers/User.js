const { v4: uuid } = require("uuid");
const User = require("../model/User.js");
const { generateJWT } = require("../firebase/auth.js"); // only custom JWT now
const admin= require('../firebase/firebase.js')

async function signinwithGoogle(req, res) {
  try {
    const { firebaseToken } = req.body;
    if (!firebaseToken) return res.status(400).json({ message: "Firebase token required" });

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const email = decodedToken.email;
    
    if (!email) {
      return res.status(400).json({ message: "Invalid Firebase token" });
    }

    let userData = await User.findOne({ email });

    if (!userData) {
      const userId = uuid();

      const newUser = await User.create({
        id: userId,
        email: email,
      });

      const jwtToken = generateJWT({ userId: userId, email: email });

      return res.status(201).json({
        message: "User created successfully",
        data: newUser,
        token: jwtToken,
        auth: newUser
      });
    } else {
      const jwtToken = generateJWT({ userId: userData.id, email: email });

      return res.status(200).json({
        message: "User signed in successfully",
        data: userData,
        token: jwtToken,
        auth: userData
      });
    }
  } catch (error) {
    console.error("Google signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function signup(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const userId = uuid();

    const user = await User.create({
      id: userId,
      email: email,
      password: password, // in production: hash this using bcrypt
    });

    const jwtToken = generateJWT({ userId: userId, email: email });

    res.status(200).json({ message: "Account Created", data: user, token: jwtToken, auth: user });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { firebaseToken } = req.body;
    if (!firebaseToken) {
      return res.status(400).json({ message: "Firebase token required" });
    }

    // ✅ Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const email = decodedToken.email;
    if (!email) {
      return res.status(400).json({ message: "Invalid Firebase token" });
    }

    // ✅ Check if user exists in our DB
    let user = await User.findOne({ email });
    if (!user) {
      // If not, create new user
      const userId = uuid();
      user = await User.create({ id: userId, email: email });
    }

    // ✅ Generate custom JWT
    const jwtToken = generateJWT({ userId: user.id, email: email });

    res.status(200).json({ message: "Login successful", data: user, token: jwtToken, auth: user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
}

async function isUser(req, res) {
  try {
    // Since your route doesn't use middleware, manually extract and verify token
    const authHeader = req.headers.authorization;
    let userId = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const { verifyJWT } = require("../firebase/auth.js");
      const decoded = verifyJWT(token);
      if (decoded && decoded.userId) {
        userId = decoded.userId;
      }
    }

    if (userId) {
      const user = await User.find({ id: userId });

      if (user?.length !== 0) {
        return res.status(200).json({ message: "User validated", data: user[0] });
      }
    }

    return res.status(401).json({ error: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ error: "Logged Out" });
  }
}

async function logout(req, res) {
  if (!req.userId) {
    return res.status(401).json({ Error: "UserId not found" });
  }

  console.log("logout from backend");
  res.status(200).json({ msg: "loggedout" });
}

module.exports = {
  signinwithGoogle,
  signup,
  login,
  isUser,
  logout,
};