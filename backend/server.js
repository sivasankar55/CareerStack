import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";

dotenv.config();
const app = express();
const Port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);


app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
  connectDB();
});
