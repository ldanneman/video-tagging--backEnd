const express = require("express");
const app = express();
const cors = require("cors");

const videosRoutes = require("./Routes/videos");

app.use(express.json());
app.use(cors());

app.use("/api/videos", videosRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));