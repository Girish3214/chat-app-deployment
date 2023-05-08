import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import path from "path";
// DB
import connectDB from "./db/connect.js";

// routers
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";

// error handler
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import startSocket from "./socket/index.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.JWT_SECRET));
const baseURL = process.env.BASEURL;

app.use(`${baseURL}/users`, userRouter);
app.use(`${baseURL}/chats`, chatRouter);
app.use(`${baseURL}/messages`, messageRouter);
app.use(`${baseURL}/notifications`, notificationRouter);

// -----------------DEPLOYMENT----------------------
const __dirName1 = path.resolve();
if (process.env.ENVIRONMENT === "develpment") {
  app.get("/", (req, res) => {
    res.send("API is running successfully...");
  });
} else {
  app.use(express.static(path.join(__dirName1, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirName1, "../", "client", "dist", "index.html")
    );
  });
}

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    const port = process.env.PORT || 8000;
    await connectDB();
    const server = app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    const io = new Server(server, {
      pingTimeOut: 60000,
      cors: { origin: "http://localhost:5173" },
    });
    startSocket(io);
  } catch (error) {
    console.log(error);
  }
};

start();
