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

////////

// router.post("/download", (req, res, next) => {
//   axios({
//     method: "get",
//     url: req.body.url,
//     responseType: "arraybuffer",
//   }).then(function (response) {
//     console.log(response.data);
//     var proc = new ffmpeg(response.data)
//       .videoCodec("libx264")
//       .outputOptions(["-movflags isml+frag_keyframe"])
//       .toFormat("mp4")
//       //.seekInput(offset) this is a problem with piping
//       .on("error", function (err, stdout, stderr) {
//         console.log("an error happened: " + err.message);
//         // console.log("ffmpeg stdout: " + stdout);
//         // console.log("ffmpeg stderr: " + stderr);
//       })
//       .on("end", function () {
//         console.log("Processing finished !");
//       })
//       .on("progress", function (progress) {
//         console.log("Processing: " + progress.percent + "% done");
//       })
//       // .pipe(response.data, { end: true });
//       .pipe(fs.createWriteStream("./Assets/test53.mp4"));
//   });
// });

//////
// router.post("/download", (req, res, next) => {
//   axios({
//     method: "get",
//     url: req.body.url,
//     responseType: "arraybuffer",
//   }).then(function (response) {
//     const data = new Uint8Array(Buffer.from(response.data));
//     fs.writeFile("Assets/test51.mp4", data, callback);
//   });
//   const callback = (err) => {
//     if (err) throw err;
//     console.log("It's saved!");
//   };
// });

const removeDir = function (path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path);

    if (files.length > 0) {
      files.forEach(function (filename) {
        if (fs.statSync(path + "/" + filename).isDirectory()) {
          removeDir(path + "/" + filename);
        } else {
          fs.unlinkSync(path + "/" + filename);
        }
      });
    } else {
      console.log("No files found in the directory.");
    }
  } else {
    console.log("Directory path not found.");
  }
};

const pathToDir = path.join(__dirname, "../Assets/Videos/SV");

router.post("/download", (req, res, next) => {
  console.log("starting...");
  axios({
    method: "get",
    url: req.body.url,
    responseType: "arraybuffer",
  }).then(function (response) {
    const data = new Uint8Array(Buffer.from(response.data));
    fs.writeFile("Assets/Videos/SV/test1.mp4", data, callback);
  });
  const callback = (err) => {
    if (err) {
      throw err;
    } else {
      const file = "Assets/Videos/FV/Ftest1.mp4";
      console.log("It's saved!");
      var proc = new ffmpeg("Assets/Videos/SV/test1.mp4")
        .videoCodec("libx264")
        .outputOptions(["-movflags isml+frag_keyframe"])
        .toFormat("mp4")
        //.seekInput(offset) this is a problem with piping
        .on("error", function (err, stdout, stderr) {
          console.log("an error happened: " + err.message);
          console.log("ffmpeg stdout: " + stdout);
          console.log("ffmpeg stderr: " + stderr);
        })
        .on("end", function () {
          console.log("Processing finished !");
        })
        .on("progress", function (progress) {
          console.log("Processing: " + progress.percent + "% done");
        })
        // .pipe(response.data, { end: true });
        .pipe(
          fs.createWriteStream(file, {
            flags: "w+",
          })
        );
    }
    // removeDir(pathToDir);
  };
});

// router.post("/download", (req, res, next) => {
//   axios({
//     method: "get",
//     url: req.body.url,
//     responseType: "arraybuffer",
//   }).then(function (response) {
//     // console.log("response", response.data);
//     // // const data = new Uint8Array(Buffer.from(response.data));
//     // const data = Buffer.from(response.data);
//     // console.log(data);
//     var proc = new ffmpeg(response.data)
//       .videoCodec("libx264")
//       .outputOptions(["-movflags isml+frag_keyframe"])
//       .toFormat("mp4")
//       //.seekInput(offset) this is a problem with piping
//       .on("error", function (err, stdout, stderr) {
//         console.log("an error happened: " + err.message);
//         // console.log("ffmpeg stdout: " + stdout);
//         // console.log("ffmpeg stderr: " + stderr);
//       })
//       .on("end", function () {
//         console.log("Processing finished !");
//       })
//       .on("progress", function (progress) {
//         // console.log("Processing: " + progress.percent + "% done");
//       });
//     fs.writeFile("Assets/test51.mp4", proc, callback);
//   });

//   const callback = (err) => {
//     if (err) throw err;
//     console.log("It's saved!");
//   };
// });

router.get("/stream", function (req, res) {
  console.log("querry", req.query.path);
  // const q = req.query.path;
  // res.end("I have received the ID: " + q);
  const path = req.query.path;
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
