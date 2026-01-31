import dotenv from "dotenv";
if (process.env.NODE_ENV === "development") {
  dotenv.config();
}
import express, { application } from "express";
import mongoose from "mongoose";
import { createServer, request } from "node:http";
import { Server } from "socket.io";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import postRouter from "./routes/postRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import followRouter from "./routes/followRoutes.js";
import jobRouter from "./routes/jobRoutes.js";
import connectionRouter from "./routes/connectionRoutes.js";
import notiRouter from "./routes/notiRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import analyticRouter from "./routes/analyticsRoutes.js";
import pollRouter from "./routes/pollRoutes.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URL}`,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["*"],
    credentials: true,
  },
  pingInterval: 60000,
  pingTimeout: 60000,
});

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`, // React frontend URL
    methods: ["POST", "PATCH", "GET", "DELETE", "OPTIONS", "HEAD"],
    credentials: true, // Allow credentials (cookies) to be sent
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser("tillu"));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

main()
  .then((client) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

server.listen(8000, () => {
  console.log("Listening on 8000");
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log(`Socket connected with id${socket.id}`);
  const userId = socket.handshake.query.userId; // Get userId from query or auth token
  //const userId = req.user._id;
  // console.log(userId);

  userSocketMap[userId] = socket.id;
  console.log(userSocketMap);

  socket.on("join-room", (roomId) => {
    //console.log( roomId);
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    socket.removeAllListeners();
    console.log(`Socket ${socket.id} disconnected`);
  });
});

app.use("/users", userRouter);
app.use("/connection", connectionRouter);
app.use("/chat", chatRouter);
app.use("/jobs", jobRouter);
app.use("/post", postRouter);
app.use("/post/:id/like", likeRouter);
app.use("/post/:id/comment", commentRouter);
app.use("/notification", notiRouter);
app.use("/profile", profileRouter);
app.use("/follow", followRouter);
app.use("/analytics", analyticRouter);
app.use("/poll", pollRouter);

app.all("*", (req, res) => {
  throw new Error(404, "Page not found!");
});

//Error handling middleware.

app.use((err, req, res, next) => {
  let { status = 400, message = "Something went wrong!!" } = err;
  res.status(status).send(message);
  console.log(err);
  next(err);
});

export { userSocketMap, io };
