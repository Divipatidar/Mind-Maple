import express, { urlencoded, json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/router.js";
import {connectDB} from "./db/connect.js";
import  {setupGeminiChat} from "./gemini/chat.js";
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: ["set-cookie", "token"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cookieParser());

app.use(router);
const initServer = async () => {
    try {
      const port = 8000;
      await connectDB();
      console.log("DB Connected");
      // init gemini
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