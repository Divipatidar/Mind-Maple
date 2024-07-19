
import  Router  from "express";
import {connectWithChatBot}  from "../controllers/chat.js";
import {doAnalysis }from "../controllers/analysis.js";
import {getAnalysis} from "../controllers/analysis.js";
import {userMiddleware} from "../middleware/getUserId.js";
import {signup} from "../controllers/User.js";
import {login }from "../controllers/User.js";
import {isUser} from "../controllers/User.js";
import {logout }from "../controllers/User.js";
import {signinwithGoogle} from "../controllers/User.js";




const router = Router();
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

export default router;