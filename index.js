const express = require("express");
const app = express();
const cors = require("cors");

// var S3 = require("aws-sdk").S3,
//   S3S = require("s3-streams");
const videosRoutes = require("./Routes/videos");

app.use(express.json());
app.use(cors());

app.use("/api/videos", videosRoutes);


const port = 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));