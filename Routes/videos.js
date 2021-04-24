const router = require("express").Router();
const videoList = require("../lib/aws");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const Raw_File = require("../Model/raw_file");
const Incident_File = require("../Model/incident_file");
const videoController = require("../Controller/videoController");
const authorize = require("../lib/auth");
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

router.post("/get-videos", (req, res, next) => {
  console.log("REQUEST BODY", req.body);
  const params = {
    Bucket: req.body.Bucket,
    Prefix: req.body.Prefix,
    Delimiter: req.body.Delimiter,
  };
  let videoURLs = videoList.list2(params, async (videoURLs) => {
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
  // return console.log(videoURLs);
});

router.get("/testing2", async (req, res, next) => {
  let videoURLs = videoList.fullList22(req.body, (videoURLs) => {
    // return [...videoURLs, 100];
    try {
      res.send(videoURLs);
    } catch (err) {
      console.log(err);
      res.status(403).send(err, "there was an err");
    }
  });
  // return console.log(videoURLs);
});

router.get("/testing", async (req, res, next) => {
  let videos = videoList.fullList(async (videoURLs) => {
    // const lastSlash = new RegExp(/\/(?!.*\/)/);

    // console.log(hello.replace(lastSlash, ""));
    try {
      res.send(videoURLs);
    } catch (err) {
      console.log(err);
      res.status(403).send(err, "there was an err");
    }
  });
});

router.get("/testing4", async (req, res, next) => {
  let videos = videoList.list3(req.body, (videoURLs) => {
    // const lastSlash = new RegExp(/\/(?!.*\/)/);

    // console.log(hello.replace(lastSlash, ""));
    try {
      res.send(videoURLs);
    } catch (err) {
      console.log(err);
      res.status(403).send(err, "there was an err");
    }
  });
});

router.post("/download", authorize.user, videoController.download);

router.get("/stream", function (req, res) {
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
  let US = req.body.user_status;
  const incidentFilesExist = await Incident_File.findOne({
    s3_path: req.body.s3_path,
  });

  if (incidentFilesExist) {
    let updateParams = {};
    switch (US) {
      case 1:
        updateParams = {
          "tags_for_review.internal_review.reviewer.flag": req.body.flag,
          "tags_for_review.internal_review.reviewer.comments":
            req.body.comments,
        };
        break;
      case 2:
        updateParams = {
          "tags_for_review.internal_review.manager_review.flag": req.body.flag,
          "tags_for_review.internal_review.manager_review.comments":
            req.body.comments,
        };

        break;
      case 3:
        updateParams = {
          "tags_for_review.client_review.flag": req.body.flag,
          "tags_for_review.client_review.comments": req.body.comments,
        };
        break;
    }
    try {
      Incident_File.updateOne(
        { _id: incidentFilesExist._id },
        updateParams,
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
