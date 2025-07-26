const express = require("express");
const { urlencoded, json } = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router/router.js");
const { connectDB } = require("./db/connect.js");
const { setupGeminiChat } = require("./gemini/chat.js");
const { userMiddleware } = require("./middleware/getUserId.js");

const app = express();

// ✅ Step 1: Set fallback CORS headers (optional but safe)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://mind-maple-steel.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Step 2: CORS middleware
app.use(
  cors({
    origin: "https://mind-maple-steel.vercel.app", // allow only your frontend
    credentials: true, // allow sending cookies/JWT
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // clean list
    exposedHeaders: ["Authorization"], // allow frontend to read token if needed
  })
);

// ✅ Step 3: Body & cookie parsers
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());



// ✅ Step 5: Routes
app.use(router);

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello divya" });
});

// ✅ Step 6: Start server
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
