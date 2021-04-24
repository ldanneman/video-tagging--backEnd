const AwsS3 = require("aws-sdk/clients/s3");
const dotenv = require("dotenv");
dotenv.config();

const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const BUCKET_NAME = "daycare.videos";
const Prefix = "";
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
  Delimiter: "/",
  Prefix: "",
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
    console.log(data);
    let keyArray = [];
    if (err) console.log(err, err.stack);
    else {
      let contents = data.CommonPrefixes;
      // console.log(data.Contents);
      for (let i = 0; i < contents.length; i++) {
        keyArray.push(contents[i].Prefix);
      }
      func(keyArray);
      // console.log(keyArray);
    }
  });
};

module.exports.fullList22 = (arr, func) => {
  console.log("Arr", arr);
  s3.listObjectsV2(arr, function (err, data) {
    console.log(data);
    let keyArray = [];
    if (err) console.log(err, err.stack);
    else {
      let contents = data.CommonPrefixes;
      // console.log(data.Contents);
      for (let i = 0; i < contents.length; i++) {
        keyArray.push(contents[i].Prefix.replace(arr.Prefix, ""));
      }
      func(keyArray);
      // console.log(keyArray);
    }
  });
};
module.exports.fullList2 = (arr, func) => {
  console.log("Arr", arr);
  s3.listObjectsV2(arr, function (err, data) {
    console.log(data);
    let keyArray = [];
    if (err) console.log(err, err.stack);
    else {
      let contents = data.CommonPrefixes;
      // console.log(data.Contents);
      for (let i = 0; i < contents.length; i++) {
        z = contents[i].Prefix.replace(arr.Prefix, "").split("/");
        for (let j = 0; j < z.length; z++) {
          keyArray.push([z[0], [z[1], [z[2]]]]);
          // keyArray.push(z);
        }
      }
      func(keyArray);
      // console.log(keyArray);
    }
  });
};

module.exports.fullList3 = (arr, func) => {
  let keyArray = [];
  // console.log("Arr", arr);
  s3.listObjectsV2(arr, function (err, data) {
    // console.log("FIRST DATA", data);

    if (err) console.log(err, err.stack);
    else {
      let contents = data.CommonPrefixes;
      // console.log(data.Contents);
      for (let i = 0; i < contents.length; i++) {
        keyArray.push([contents[i].Prefix.replace(data.Prefix, "")]);
      }

      for (let i = 0; i < keyArray.length; i++) {
        s3.listObjectsV2(
          { ...arr, Prefix: contents[i].Prefix },
          async function (err, data) {
            if (err) console.log(err, err.stack);
            else if (data.CommonPrefixes.length != 0) {
              let next = [];
              // console.log(data);
              for (let i = 0; i < data.CommonPrefixes.length; i++) {
                // console.log(data.CommonPrefixes[i].Prefix);
                next.push([
                  data.CommonPrefixes[i].Prefix.replace(data.Prefix, ""),
                ]);
              }
              console.log(next);
              keyArray[i].push(next);
            } else {
            }
            // else {
            //   console.log(data);
            //   !data.CommonPrefixes.length == 0 &&
            //     keyArray[i].push([data?.CommonPrefixes]);
            // }

            if (i == keyArray.length - 1) {
              func(keyArray);
            }
            // console.log(keyArray);
          }
        );
      }
    }
  });
};

module.exports.list2 = (arr, func) => {
  console.log("Arr", arr);

  s3.listObjectsV2(arr, function (err, data) {
    let keyArray = [];
    if (err) console.log(err, err.stack);
    else {
      let contents = data.Contents;
      for (let i = 0; i < contents.length; i++) {
        const signedParams = {
          Bucket: arr.Bucket,
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

module.exports.list3 = (arr, func) => {
  console.log("jell");
  var allKeys = [];
  function listAllKeys(token, cb) {
    console.log("token", token);
    var opts = arr;
    if (token) opts.Bucket.ContinuationToken = token;

    s3.listObjectsV2(opts, function (err, data) {
      allKeys = allKeys.concat(data.Contents);

      if (data.IsTruncated) listAllKeys(data.NextContinuationToken, cb);
      else cb;
    });
    func(allKeys);
    console.log(allKeys);
  }
  listAllKeys();
};
