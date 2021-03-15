const router = require("express").Router();
const videoList = require("../aws");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

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

// router.post("/download", (req, res, next) => {
//   var stream = aws.s3(s3Bucket).getObject(s3Path).createReadStream();
//   var proc = new ffmpeg(stream)
//     .outputOptions(["-movflags isml+frag_keyframe"])
//     .toFormat("mp4")
//     .withAudioCodec("copy")
//     //.seekInput(offset) this is a problem with piping
//     .on("error", function (err, stdout, stderr) {
//       console.log("an error happened: " + err.message);
//       console.log("ffmpeg stdout: " + stdout);
//       console.log("ffmpeg stderr: " + stderr);
//     })
//     .on("end", function () {
//       console.log("Processing finished !");
//     })
//     .on("progress", function (progress) {
//       console.log("Processing: " + progress.percent + "% done");
//     })
//     .pipe(res, { end: true });
// })

router.post("/download", (req, res, next) => {
  axios({
    method: "get",
    url: req.body.url,
    responseType: "stream",
  }).then(function (response) {
    var proc = new ffmpeg(response.data)
      .outputOptions(["-movflags isml+frag_keyframe"])
      .toFormat("mp4")
      //.seekInput(offset) this is a problem with piping
      .on("error", function (err, stdout, stderr) {
        console.log("an error happened: " + err.message);
        // console.log("ffmpeg stdout: " + stdout);
        // console.log("ffmpeg stderr: " + stderr);
      })
      .on("end", function () {
        console.log("Processing finished !");
      })
      .on("progress", function (progress) {
        console.log("Processing: " + progress.percent + "% done");
      })
      // .pipe(res, { end: true })
      .pipe(fs.createWriteStream("./Assets/test53.mp4"));
  });
});

// router.get("/strea", function (req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

// router.get("/stream", (req, res) => {
//   res.sendFile("./test47.mp4", { root: __dirname });
// });

// router.get("/stream", function (req, res) {
//   // Ensure there is a range given for the video
//   const range = req.headers.range;
//   if (!range) {
//     res.status(400).send("Requires Range header");
//   }

//   // get video stats (about 61MB)
//   const videoPath = "./test47.mp4";
//   const videoSize = fs.statSync("./test47.mp4").size;

//   // Parse Range
//   // Example: "bytes=32324-"
//   const CHUNK_SIZE = 10 ** 6; // 1MB
//   const start = Number(range.replace(/\D/g, ""));
//   const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

//   // Create headers
//   const contentLength = end - start + 1;
//   const headers = {
//     "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//     "Accept-Ranges": "bytes",
//     "Content-Length": contentLength,
//     "Content-Type": "video/mp4",
//   };

//   // HTTP Status 206 for Partial Content
//   res.writeHead(206, headers);

//   // create video read stream for this particular chunk
//   const videoStream = fs.createReadStream(videoPath, { start, end });

//   // Stream the video chunk to the client
//   videoStream.pipe(res);
// });

// router.get("/strea", function (req, res) {
//   res.sendFile(__dirname + "/index.html");
// });

// router.get("/stream", function (req, res) {
//   const path =
//     "C:\\Users\\levda\\Desktop\\EyeKnow\\EyeKnow-Backend\\test47.mp4";
//   const stat = fs.statSync(path);
//   const fileSize = stat.size;

//   const head = {
//     "Content-Length": fileSize,
//     "Content-Type": "video/mp4",
//   };
//   res.writeHead(200, head);
//   fs.createReadStream(path).pipe(res);
// });

router.get("/stream", function (req, res) {
  const path = "Assets/test47.mp4";
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = router;
