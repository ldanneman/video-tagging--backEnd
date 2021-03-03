const router = require("express").Router();
const videoList = require("../aws");

router.get("/", async (req, res, next) => {
  let videoURLs = videoList.list((videoURLs) => {
    try {
      console.log(videoURLs);
      console.log(typeof videoURLs);
      res.send(videoURLs);

      // res.send({ urls: (videoURLs) });
    } catch (err) {
      console.log(err);
      res.status(403).send(err, "there was an err");
    }
  });
});

module.exports = router;
