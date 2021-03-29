const router = require("express").Router();
const videoList = require("../aws");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Raw_File = require("../Model/raw_file");
const Incident_File = require("../Model/incident_file");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

router.get("/", async (req, res, next) => {
  let videoURLs = videoList.list(async (videoURLs) => {
    try {
      res.send(videoURLs);
    } catch (err) {
      console.log(err);
      res.status(403).send(err, "there was an err");
    }
    for (let i = 0; i < videoURLs.length; i++) {
      const reSlash = new RegExp(/\//g);
      const lastMp4 = new RegExp(/mp4(?!.*mp4)/);
      const lastSlash = new RegExp(/\/(?!.*\/)/);
      let fileName = `${
        videoURLs[i].split(lastMp4)[0].split(lastSlash)[1].split("mp4")[1]
      }mp4`;
      let encoded = encodeURI(videoURLs[i]);
      let s3Path =
        encoded.toString().split("com/")[1].split(lastMp4)[0] + "mp4";
      const rawFilesExist = await Raw_File.findOne({ s3_path: s3Path });
      if (!rawFilesExist) {
        const rawFile = new Raw_File({
          file_name: fileName,
          s3_path: s3Path,
          duration: null,
          size: null,
          incident_files: [],
        });
        try {
          let savedRawFile = await rawFile.save();
          console.log(`${fileName} is saved`);
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log(`${fileName} already exists`);
      }
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

// const removeDir = function (path) {
//   if (fs.existsSync(path)) {
//     const files = fs.readdirSync(path);

//     if (files.length > 0) {
//       files.forEach(function (filename) {
//         if (fs.statSync(path + "/" + filename).isDirectory()) {
//           removeDir(path + "/" + filename);
//         } else {
//           fs.unlinkSync(path + "/" + filename);
//         }
//       });
//     } else {
//       console.log("No files found in the directory.");
//     }
//   } else {
//     console.log("Directory path not found.");
//   }
// };

// const pathToDir = path.join(__dirname, "../Assets/Videos/SV");

// router.post("/download", (req, res, next) => {
//   let fileCount = fs.readdirSync("Assets/Videos/FV").length;
//   for (let i = 0; i < req.body.length; i++) {
//     let pathUrl = req.body[i].path + "";
//     const reSlash = new RegExp(/\//g);
//     const lastMp4 = new RegExp(/mp4(?!.*mp4)/);
//     let key = pathUrl
//       .toString()
//       .split("com/")[1]
//       .split(lastMp4)[0]
//       .replace(reSlash, "-");
//     let fv = path.join(__dirname, `../Assets/Videos/FV/${key}mp4`);
//     let sv = path.join(__dirname, `../Assets/Videos/SV/${key}mp4`);
//     if (!fs.existsSync(fv)) {
//       console.log("starting...");
//       axios({
//         method: "get",
//         url: req.body[i].path,
//         responseType: "arraybuffer",
//       })
//         .then(function (response) {
//           const data = new Uint8Array(Buffer.from(response.data));
//           fs.writeFile(sv, data, callback);
//         })
//         .catch(function (err) {
//           console.log(err);
//         });
//       const callback = (err) => {
//         if (err) {
//           throw err;
//         } else {
//           const file = fv;
//           console.log("It's saved!");
//           var proc = new ffmpeg(sv)
//             .videoCodec("libx264")
//             .outputOptions(["-movflags isml+frag_keyframe"])
//             .toFormat("mp4")
//             //.seekInput(offset) this is a problem with piping
//             .on("error", function (err, stdout, stderr) {
//               console.log("an error happened: " + err.message);
//               console.log("ffmpeg stdout: " + stdout);
//               console.log("ffmpeg stderr: " + stderr);
//             })
//             .on("end", function () {
//               fileCount++;
//               console.log("Processing finished !");
//               console.log("filecount", fileCount);

//               if (fileCount == req.body.length) {
//                 // removeDir(pathToDir);
//                 // res.header("Access-Control-Allow-Origin", "*");
//                 return res.send("first finished");
//               }
//             })
//             .on("progress", function (progress) {
//               console.log("Processing: " + progress.percent + "% done");
//             })
//             // .pipe(response.data, { end: true });
//             .pipe(
//               fs.createWriteStream(file, {
//                 flags: "w+",
//               })
//             );
//         }
//       };
//     } else {
//       console.log("the file already exists");
//     }
//   }

//   console.log("filecount", fileCount);
//   console.log("body", req.body.length);

//   if (fileCount == req.body.length) {
//     return res.send("last finished");
//   }

// });

router.post("/download", (req, res, next) => {
  console.log("yyyyyyyyy", req.body);
  // console.log("mmm", req.body.url);
  // console.log("qqq", req.body.path);
  // console.log("lll", req.body.url.path);
  console.log("pppppppp");
  //  let fileCount = fs.readdirSync("Assets/Videos/FV").length;

  let pathUrl = req.body.path + "";
  const reSlash = new RegExp(/\//g);
  const lastMp4 = new RegExp(/mp4(?!.*mp4)/);
  let key = pathUrl
    .toString()
    .split("com/")[1]
    .split(lastMp4)[0]
    .replace(reSlash, "-");
  let fv = path.join(__dirname, `../Assets/Videos/FV/${key}mp4`);
  let sv = path.join(__dirname, `../Assets/Videos/SV/${key}mp4`);
  if (!fs.existsSync(fv)) {
    console.log("starting...");
    axios({
      method: "get",
      url: req.body.path,
      responseType: "arraybuffer",
    })
      .then(function (response) {
        const data = new Uint8Array(Buffer.from(response.data));
        fs.writeFile(sv, data, callback);
      })
      .catch(function (err) {
        console.log(err);
      });
    const callback = (err) => {
      if (err) {
        throw err;
      } else {
        const file = fv;
        console.log("It's saved!");
        var proc = new ffmpeg(sv)
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
            return res.send("first finished");
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
    };
  } else {
    console.log("the file already exists");
    res.send("last finished");
  }
});

router.get("/stream", function (req, res) {
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

router.post("/deletefv", (req, res, next) => {
  try {
    const pathToFV = path.join(__dirname, "../Assets/Videos/FV");
    removeDir(pathToFV);
    removeDir(pathToDir);
    res.send("Videos Deleted");
  } catch (err) {
    res.send(err);
  }
});

router.post("/tag", async function (req, res) {
  console.log("tagged", typeof req.body.flag);
  const incidentFilesExist = await Incident_File.findOne({
    s3_path: req.body.s3_path,
  });

  if (incidentFilesExist) {
    try {
      Incident_File.updateOne(
        { _id: incidentFilesExist._id },
        { flag: req.body.flag },
        function (err, result) {
          if (err) {
            res.send(err);
          } else {
            res.send(result);
          }
        }
      );
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    let rawFile = await Raw_File.findOne({ s3_path: req.body.s3_path });
    let US = req.body.user_status;

    const incident = new Incident_File({
      file_name: rawFile.file_name,
      s3_path: rawFile.s3_path,
      raw_file_id: rawFile._id,
      size: req.body.size ?? undefined,
      duration: req.body.duration ?? undefined,
      classifier_id: req.body.classifier_id ?? undefined,
      tags_for_review: {
        internal_review: {
          reviewer: {
            ...(US == 1
              ? {
                  date_time: undefined,
                  flag: req.body.flag,
                  comments: req.body.comments,
                }
              : { date_time: null, flag: undefined, comments: undefined }),
          },
          manager_review: {
            ...(US == 2
              ? {
                  date_time: undefined,
                  flag: req.body.flag,
                  comments: req.body.comments,
                }
              : { date_time: null, flag: undefined, comments: undefined }),
          },
        },
        client_review: {
          ...(US == 3
            ? {
                date_time: undefined,
                flag: req.body.flag,
                comments: req.body.comments,
              }
            : { date_time: null, flag: undefined, comments: undefined }),
        },
      },
    });
    try {
      const savedIncident = await incident.save();
      res.send("Incident Saved");
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

module.exports = router;
