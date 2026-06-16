import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// route imports
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import watchHistoryRouter from "./routes/watchHistory.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import notificationRouter from "./routes/notification.routes.js";

const app = express();

app.get("/hello", (req, res) => {
  res.send("HELLO FROM EXPRESS");
});

console.log("CORS_ORIGIN =", process.env.CORS_ORIGIN);

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// route declarations
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/watch-history", watchHistoryRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/notifications", notificationRouter);

// Global error handler ✅
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

export { app };