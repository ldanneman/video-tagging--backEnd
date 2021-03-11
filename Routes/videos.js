const router = require("express").Router();
const videoList = require("../aws");
const axios = require("axios");
const fs = require("fs");

router.get("/", async (req, res, next) => {
  let videoURLs = videoList.list((videoURLs) => {
    try {
      console.log(videoURLs);
      console.log(typeof videoURLs);
      res.send(videoURLs);
    } catch (err) {
      console.log(err);
      res.status(403).send(err, "there was an err");
    }
  });
});

router.post("/download", (req, res, next) => {
  axios({
    method: "get",
    url: req.body.url,
    responseType: "stream",
  }).then(function (response) {
    response.data.pipe(fs.createWriteStream("./Assets/test46.mp4"));
  });
  console.log("zzz", req.body.url);
  // res.status(200).send(req.body);
});

module.exports = router;
