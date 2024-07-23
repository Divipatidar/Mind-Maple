const { v4: uuid } = require("uuid");
const User = require("../model/User.js");
const { decodeAuthToken } = require("../firebase/auth.js");

// Function for signing in with Google
async function signinwithGoogle(req, res) {
  try {
    const token = req.headers.token;
    const email = await decodeAuthToken(token);
    console.log(email);
    
    if (!email) {
      res.status(401).json({ message: "Invalid Access Token" });
      return;
    }

    const data = await User.findOne({ email: email });

    if (req.cookies?.userid) {
      // Chat already done
      if (!data) {
        // User not created yet
        const uuid = req.cookies.userid;

        // Create user account
        const user = await User.create({
          id: uuid,
          email: email,
        });

        res.status(200).json({ data: user });
      } else {
        // User already created
        const data = await User.findOne({ email: email });

        if (data?.id) {
          res.cookie("userid", data.id, {
            maxAge: 1209600000, // 14 days
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
        }

        res.status(200).json({ data: data });
      }
    } else {
      if (!data) {
        // User not created yet
        const userId = uuid();

        // Set the cookie
        res.cookie("userid", userId, {
          maxAge: 1209600000, // 14 days
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });

        const user = await User.create({
          id: userId,
          email: email,
        });
        res.status(200).json({ data: user });
      } else {
        // User already created
        const user = await User.findOne({ email: email });

        if (user?.id) {
          res.cookie("userid", user.id, {
            maxAge: 1209600000, // 14 days
            httpOnly: true,
            sameSite: "None",
            secure: true,
          });
        }
    
        res.status(200).json({ data: user });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid Access Token" });
  }
}

// Function for signing up
async function signup(req, res) {
  try {
    const token = req.headers.token;
    console.log(req.headers.token + " here");
    const email = await decodeAuthToken(token);
    console.log(email);
    
    if (!email) {
      res.status(401).json({ message: "Invalid Access Token" });
      return;
    }

    if (req.cookies?.userid) {
      console.log(req.cookies.userid);
      // Chat already done
      const uuid = req.cookies.userid;

      // Create user account
      const user = await User.create({
        id: uuid,
        email: email,
      });

      res.status(200).json("Account Created");
    } else {
      // Chat not done yet
      // Generate the UUID and return a cookie
      const userId = uuid();

      // Set the cookie
      res.cookie("userid", userId, {
        maxAge: 1209600000, // 14 days
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });

      const user = await User.create({
        id: userId,
        email: email,
      });

      // We are not creating a report here since there is no analysis yet
      // When the chat is done, the user will hit the analysis route again
      // We will create the report then and store it in the user document

      res.status(200).json("Account Created");
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ message: "Invalid Access Token" });
  }
}

// Function for logging in
async function login(req, res) {
  try {
    const email = await decodeAuthToken(req.headers.token);
    console.log("email in login" + email);
    
    if (!email) {
      res.status(401).json({ message: "Invalid Access Token" });
      return;
    }

    // Get Data from email from database
    const data = await User.findOne({ email: email });
    console.log(data + "    data is here");

    if (data?.id) {
      res.cookie("userid", data.id, {
        maxAge: 1209600000, // 14 days
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    res.status(200).json({ data: data });
  } catch (error) {
    res.status(401).json({ message: "Invalid Access Token" });
  }
}

// Function to check if the user is authenticated
async function isUser(req, res) {
  try {
    console.log("is user cookie", req.cookies);
    
    if (req.cookies?.userid) {
      const userid = req.cookies?.userid;
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

// Function for logging out
async function logout(req, res) {
  if (!req.cookies?.userid) {
    res.status(401).json({ Error: "UserId not found" });
    return;
  }

  res.cookie("userid", null, {
    maxAge: 0,
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  console.log("logout from logout backend");
  res.status(200).json({ msg: "loggedout" });
}

module.exports = {
  signinwithGoogle,
  signup,
  login,
  isUser,
  logout
};
