const { v4: uuid } = require("uuid");
const User = require("../model/User.js");
const { decodeAuthToken, generateJWT } = require("../firebase/auth.js");


async function signinwithGoogle(req, res) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization token provided" });
    }

    console.log("Attempting to decode token...");
    
    // Pass the full header to decodeAuthToken - it will handle the parsing
    const email = await decodeAuthToken(authHeader);
    console.log("Decoded email:", email);

    if (!email) {
      return res.status(401).json({ message: "Invalid Access Token" });
    }

    // Check if user exists
    let userData = await User.findOne({ email: email });

    if (!userData) {
      console.log("Creating new user for:", email);
      
      const userId = uuid();

      const newUser = await User.create({
        id: userId,
        email: email,
      });

      const jwtToken = generateJWT({ userId: userId, email: email });
      
      return res.status(201).json({ 
        message: "User created successfully",
        data: newUser, 
        token: jwtToken 
      });
    } else {
      console.log("User found:", userData.email);
      
      const jwtToken = generateJWT({ userId: userData.id, email: email });
      
      return res.status(200).json({ 
        message: "User signed in successfully",
        data: userData, 
        token: jwtToken 
      });
    }
  } catch (error) {
    console.error("Google signin error:", error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "User data validation failed" });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}


async function signup(req, res) {
  try {
    const token = req.headers.authorization;
    console.log(req.headers.authorization + " here");
    const email = await decodeAuthToken(token);
    console.log(email);

    if (!email) {
      res.status(401).json({ message: "Invalid Access Token" });
      return;
    }

    const userId = uuid();

    const user = await User.create({
      id: userId,
      email: email,
    });

    const jwtToken = generateJWT({ userId: userId, email: email });
    res.status(200).json({ message: "Account Created", token: jwtToken });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Invalid Access Token" });
  }
}


async function login(req, res) {
  try {
    const email = await decodeAuthToken(req.headers.authorization);
    console.log("email in login" + email);

    if (!email) {
      res.status(401).json({ message: "Invalid Access Token" });
      return;
    }

   
    const data = await User.findOne({ email: email });
    console.log(data + "    data is here");

    if (!data) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const jwtToken = generateJWT({ userId: data.id, email: email });
    res.status(200).json({ data: data, token: jwtToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid Access Token" });
  }
}


async function isUser(req, res) {
  try {
    console.log("is user", req.userId);

    if (req.userId) {
      const userid = req.userId;
      console.log(userid + " in user");
      const user = await User.find({ id: userid });
      console.log(user, "Here");

      if (user?.length !== 0) {
        res.status(200).json({ message: "User validated" });
      } else {
        res.status(401).json({ error: "Logged Out" });
      }
    } else {
      res.status(401).json({ error: "Logged Out" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ error: "Logged Out" });
  }
}

async function logout(req, res) {
  if (!req.userId) {
    res.status(401).json({ Error: "UserId not found" });
    return;
  }

  console.log("logout from logout backend");
  res.status(200).json({ msg: "loggedout" });
}

module.exports = {
  signinwithGoogle,
  signup,
  login,
  isUser,
  logout,
};
