/**
 * Import Packages
 */
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require('morgan')

/**
 * Load router
 */
const usersRouter = require("./routes/user_routes");

/**
 * Init Application
 */
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan('dev'))

/**
 * Users Router
 */
app.use("/api/users", usersRouter);

app.use((req, res)=>{
    res.status(404).json({error: "Page not found"})
})

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
