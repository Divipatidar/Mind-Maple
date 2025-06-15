const express = require("express");
const { urlencoded, json } = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router/router.js");
const { connectDB } = require("./db/connect.js");
const { setupGeminiChat } = require("./gemini/chat.js");
const { userMiddleware } = require("./middleware/getUserId.js");

const app = express();

app.use(
  cors({
    origin: "https://mind-maple-steel.vercel.app",
    credentials: true,
    exposedHeaders: ["set-cookie", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());
app.use(userMiddleware);

app.use(router);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello" });
});

const initServer = async () => {
  try {
    const port = 8000;
    await connectDB();
    console.log("DB Connected");

    await setupGeminiChat();

    app.listen(port, () => {
      console.log(`Backend Server Started on ${port} ...`);
    });
  } catch (err) {
    console.log(err.message);
    console.log("Server not started!");
  }
};

initServer();
