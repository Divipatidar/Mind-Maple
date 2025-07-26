const { v4: uuid } = require("uuid");
const User = require("../model/User.js");
const { generateJWT } = require("../firebase/auth.js"); // only custom JWT now

async function signinwithGoogle(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

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
      });
    } else {
      const jwtToken = generateJWT({ userId: userData.id, email: email });

      return res.status(200).json({
        message: "User signed in successfully",
        data: userData,
        token: jwtToken,
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

    res.status(200).json({ message: "Account Created", token: jwtToken });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const data = await User.findOne({ email: email });

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    if (data.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtToken = generateJWT({ userId: data.id, email: email });

    res.status(200).json({ data: data, token: jwtToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

async function isUser(req, res) {
  try {
    if (req.userId) {
      const user = await User.find({ id: req.userId });

      if (user?.length !== 0) {
        return res.status(200).json({ message: "User validated" });
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
