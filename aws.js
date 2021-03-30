var AwsS3 = require("aws-sdk/clients/s3");

const ACCESS_KEY_ID = "AKIA6OHOPCC5DWJXXO7O";
const SECRET_ACCESS_KEY = "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";

const BUCKET_NAME = "daycare.videos";
const Prefix = "Little Brother/Agadata/2020_12_21/Gdolim/aggressive/";
const Delimiter = "/";
const region = "eu-north-1";

const s3 = new AwsS3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  Bucket: BUCKET_NAME,
  Delimiter: Delimiter,
  Prefix: Prefix,
  region: region,
  signatureVersion: "v4",
});

const s3params = {
  Bucket: BUCKET_NAME,
  Delimiter: Delimiter,
  Prefix: Prefix,
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
    }
  });
};
