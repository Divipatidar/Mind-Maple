const { v4: uuid } = require("uuid");

async function userMiddleware(req, res, next) {
  const userId = req.cookies?.userid;
  console.log("usemiddleware userid ", userId);
  if (userId && userId.trim() !== "") {
    req.userId = userId;
  } else {
    const newUserId = uuid();
    req.userId = newUserId;
    res.cookie("userid", newUserId, {
      maxAge: 1209600000, //14 * 24 * 60 * 60 * 1000 -> 14days
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
  }

  next();
}

module.exports = {
  userMiddleware,
};
