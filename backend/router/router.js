const express = require("express");
const { connectWithChatBot } = require("../controllers/chat.js");
const { doAnalysis, getAnalysis } = require("../controllers/analysis.js");
const { userMiddleware } = require("../middleware/getUserId.js");
const { signup, login, isUser, logout, signinwithGoogle } = require("../controllers/User.js");

const router = express.Router();

router.route("/cron").get((req, res) => {
  res.status(200).json({ message: "hello" });
});

router.route("/chat").get(userMiddleware, connectWithChatBot);
router.route("/analysis").get(userMiddleware, doAnalysis);
router.route("/fetchanalysis").get(userMiddleware, getAnalysis);
router.route("/signup").post(signup);
router.route("/signupWithGoogle").post(signinwithGoogle);
router.route("/login").post(login);
router.route("/isUser").get(isUser);
router.route("/logout").get(logout);

module.exports = router;
