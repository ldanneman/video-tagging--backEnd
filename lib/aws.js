var AwsS3 = require("aws-sdk/clients/s3");
const dotenv = require("dotenv");
dotenv.config();

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const BUCKET_NAME = "daycare.videos";
const Prefix = "Little-Brother_Agadata/2020_12_21/Gdolim/aggressive/";
const Delimiter = "/";
const region = "eu-north-1";

const s3 = new AwsS3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  region: region,
  signatureVersion: "v4",
});

const s3params = {
  Bucket: BUCKET_NAME,
  Delimiter: Delimiter,
  Prefix: Prefix,
};

const s3params2 = {
  Bucket: BUCKET_NAME,
  Delimiter: "",
  Prefix: "Little-Brother_Agadata/",
};

module.exports.list = (func) => {
  s3.listObjectsV2(s3params, function (err, data) {
    let keyArray = [];
    if (err) console.log(err, err.stack);
    else {
      let contents = data.Contents;
      for (let i = 0; i < contents.length; i++) {
        const signedParams = {
          Bucket: BUCKET_NAME,
          Key: contents[i].Key,
        };
        const url = s3.getSignedUrl("getObject", signedParams);
        keyArray.push(url);
      }
      func(keyArray);
      // console.log(keyArray);
    }
  });
};

module.exports.fullList = (func) => {
  s3.listObjectsV2(s3params2, function (err, data) {
    let keyArray = [];
    if (err) console.log(err, err.stack);
    else {
      let contents = data.Contents;
      // console.log(data.Contents);
      for (let i = 0; i < contents.length; i++) {
        keyArray.push(contents[i].Key);
      }
      func(keyArray);
      console.log(keyArray);
    }
  });
};

// module.exports.fullList = (func) => {
//   s3.getObject(s3params2, function (err, data) {
//     let keyArray = [];
//     if (err) console.log(err, err.stack);
//     else {
//       console.log(data);
//     }
//   });
// };
