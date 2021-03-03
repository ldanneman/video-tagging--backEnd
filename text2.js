// const router = require("express").Router();
const axios = require("axios");

const AWS = require("aws-sdk");
// var AwsS3 = require("aws-sdk/clients/s3");

const fs = require("fs");
const ACCESS_KEY_ID = "AKIA6OHOPCC5DWJXXO7O";
const SECRET_ACCESS_KEY = "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";
const BUCKET_NAME = "eyeknow-data/";
const Prefix = "Test";
const Delimiter = "/";
const region = "us-east-1";

const s3 = new AWS.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  Bucket: BUCKET_NAME,
  Delimiter: Delimiter,
  Prefix: Prefix,
  region: region,
});

// const params = {
//   Bucket: BUCKET_NAME,
//   Key: "Recording__2020-10-10__11-18-8.mp4",
// };

const listDirectories = (params) => {
  return new Promise((resolve, reject) => {
    const s3params = {
      Bucket: BUCKET_NAME,
      Delimiter: Delimiter,
    };
    s3.listObjectsV2(s3params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
// router.get("/", (req, res) => {});

// module.exports = router;
