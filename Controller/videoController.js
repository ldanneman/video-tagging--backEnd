const path = require("path");
const fs = require("fs");
const axios = require("axios");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const download = (req, res, next) => {
  console.log("REQEUST BODY", req.body);
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
            return res.status(200).send("first finished");
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
    res.status(200).send("last finished");
  }
};

module.exports = {
  download,
};
