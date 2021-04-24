const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

//Import Routes
const videosRoutes = require("./Routes/videos");
const authRoutes = require("./Routes/auth");
const dataRoutes = require("./Routes/data");
//Connection to Database
dotenv.config();
const mongoConnection = process.env.MONGODB_URI || process.env.DB_CONNECT;
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
};

mongoose.connect(mongoConnection, options, (err) =>
  err
    ? console.log("there was an error connecting to db", err)
    : console.log("connected to DB")
);

//Global Middlewares
app.use(express.json());
app.use(cors());
// app.use(extendTimeout.extendTimeoutMiddleware);

//Routes Middlewares
app.use("/api/videos", videosRoutes);
app.use("/api/user", authRoutes);
app.use("/api/data", dataRoutes);

//Server Initiation
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) =>
  err
    ? console.log("there was a server error")
    : console.log(`Server is running on port ${PORT}`)
);
