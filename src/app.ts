import express, { Application } from "express";
import { postRouter } from "./Modules/post/post.routes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from 'cors';

const app: Application = express();
app.use(express.json());
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:4000",
}))

//* better-auth route handler for authentication
app.all("/api/auth/*splat", toNodeHandler(auth));

//* server root route
app.route("/").get((req, res) => {
  res.send("Hello, World!");
});

//* Post routes
app.use("/posts", postRouter);

export { app };
