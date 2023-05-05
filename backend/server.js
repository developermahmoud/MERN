/**
 * Import Packages
 */
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";

/**
 * Load router
 */
import usersRouter from "./routes/user_routes.js";

/**
 * Init Application
 */
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));

/**
 * Users Router
 */
app.use("/api/users", usersRouter);

/**
 * Handle Not Found Page
 */
app.use((req, res) => {
  res.status(404).json({ error: "Page not found" });
});

/**
 * Connect To DB And Listen to server
 */
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("server running.");
    });
  })
  .catch((err) => {
    console.log(err);
  });
