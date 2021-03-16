const axios = require("axios");
var http = require("http");
const https = require("https");
var fs = require("fs");
const path = require("path");
const promisify = require("util.promisify");
// import * as stream from "stream";
const stream = require("stream");

const url =
  //   "https://s3.eu-north-1.amazonaws.com/daycare.videos/iland-guard/yamit/2020-12-09/cam_0/20201209_043123.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA6OHOPCC5DWJXXO7O%2F20210311%2Feu-north-1%2Fs3%2Faws4_request&X-Amz-Date=20210311T171653Z&X-Amz-Expires=900&X-Amz-Signature=5d5cb3bf3e1a30d20f515b8cc547bbaad694b98715bffa28863f8a2db42c8357&X-Amz-SignedHeaders=host";
  //   "https://res.cloudinary.com/coolps811/video/upload/v1615482718/u9wuqpleolmtotoyyfra.mp4";
  "https://res.cloudinary.com/coolps811/image/upload/v1609684966/petproject/vkgrwhehp36ay9b2jy5c.png";
//   "https://www.youtube.com/watch?v=ewOAsUWQJvo&ab_channel=AVROTROS";
// "../../../Downloads/video.mp4";
//   "https://drive.google.com/file/d/1iqWSVJlNvXoUXi4z8LsPNeqk1OZ7ahYC/view?usp=sharing";
//   "https://eyeknow-data.s3.amazonaws.com/Test/Recording__2020-10-10__11-41-48.mp4";
const downloadDestination = "./Assets/test34.mp4";

const download = () => {
  axios({
    method: "get",
    //   url: "tinyurl.com/2rx5mpxm ",
    url: "../../../Downloads/video.mp4",
    responseType: "stream",
  }).then(function (response) {
    response.data.pipe(fs.createWriteStream("./Assets/test36.mp4"));
  });
};

const download2 = async () => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFile(downloadDestination, res.data);
  console.log(res.data);
};

const download3 = async () => {
  const path = Path.resolve(__dirname, "Assets", "test14.mp4");

  const response = await axios({
    method: "GET",
    url: url,
    responseType: "stream",
  });

  response.data.pipe(fs.createWriteStream(path));

  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      resolve();
    });
    response.data.on("error", (err) => {
      reject(err);
    });
  });
};

const download4 = () => {
  axios({
    method: "get",
    url:
      "https://res.cloudinary.com/coolps811/video/upload/v1615482718/u9wuqpleolmtotoyyfra.mp4",
    responseType: "stream",
  }).then(function (response) {
    response.data.pipe(fs.createWriteStream("./Assets/test50.mp4"));
    console.log(response.data);
  });
};
// download4();

const download5 = () => {
  axios({
    method: "get",
    url: url,
    responseType: "stream",
  }).then(function (response) {
    response.data.pipe(fs.createWriteStream("./Assets/test36.mp4"));
  });
};

const finished = promisify(stream.finished);

function downloadFile(fileUrl, outputLocationPath) {
  return new Promise(function (resolve, reject) {
    const writer = fs.createWriteStream(outputLocationPath);
    return axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    }).then((response) => {
      response.data.pipe(writer);
      return finished(writer); //this is a Promise
    });
  });
}

// downloadFile(url, "./Assets/");

async function downloadImage() {
  const url = "https://unsplash.com/photos/AaEQmoufHLk/download?force=true";
  const path = Path.resolve(__dirname, "Assets", "test37.mp4");
  const writer = fs.createWriteStream(path);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

// downloadImage();

async function downloadFile2(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  }).then((response) => {
    //ensure that the user can call `then()` only when the file has
    //been downloaded entirely.

    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    });
  });
}

// downloadFile2(url, "./Assets/");

const download8 = () => {
  const fs = require("fs");

  const path2 = "./Assets/test40.mp4"; // where to save a file

  const request = https.get(url, function (response) {
    if (response.statusCode === 200) {
      var file = fs.createWriteStream(path2);
      response.pipe(file);
    }
    request.setTimeout(60000, function () {
      // if after 60s file not downlaoded, we abort a request
      request.abort();
    });
  });
};

// download8();
const y = "test";

const x = `Assets/${y}.mp4`;
console.log(x);
