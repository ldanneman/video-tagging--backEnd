var AwsS3 = require("aws-sdk/clients/s3");

const ACCESS_KEY_ID = "AKIA6OHOPCC5DWJXXO7O";
const SECRET_ACCESS_KEY = "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";
// const BUCKET_NAME = "eyeknow-data";
const BUCKET_NAME = "daycare.videos";

// const Prefix = "Test/";
const Prefix = "little-brother/tzuzikim_paotot/2020-12-01/cam_MVP_0/";
// const Prefix = "iland-guard/yamit/2020-12-09/cam_0/";

const Delimiter = "/";
// const region = "us-east-1";
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

// s3.listObjectsV2(s3params, function (err, data) {
//   let keyArray = [];

//   if (err) console.log(err, err.stack);
//   else {
//     let contents = data.Contents;

//     // console.log(data.Contents);
//     for (let i = 0; i < contents.length; i++) {
//       const signedParams = {
//         Bucket: BUCKET_NAME,
//         Key: contents[i].Key,
//       };
//       const url = s3.getSignedUrl("getObject", signedParams);
//       keyArray.push(url);
//       // keyArray.push(
//       //   `https://${BUCKET_NAME}.s3.amazonaws.com/${contents[i].Key}`
//       // );
//       // keyArray.push(
//       //   `https://s3.${region}.amazonaws.com/${BUCKET_NAME}/${contents[i].Key}`
//       // );
//     }
//     console.log(keyArray);
//   }
// });

// module.exports.list = (func) => {
//   s3.listObjectsV2(s3params, function (err, data) {
//     let keyArray = [];

//     if (err) console.log(err, err.stack);
//     else {
//       let contents = data.Contents;

//       // console.log(data.Contents);
//       for (let i = 0; i < contents.length; i++) {
//         const signedParams = {
//           Bucket: BUCKET_NAME,
//           Key: contents[i].Key,
//         };
//         const url = s3.getSignedUrl("getObject", signedParams);
//         keyArray.push(url);
//         // keyArray.push(
//         //   `https://${BUCKET_NAME}.s3.amazonaws.com/${contents[i].Key}`
//         // );
//         // keyArray.push(
//         //   `https://s3.${region}.amazonaws.com/${BUCKET_NAME}/${contents[i].Key}`
//         // );
//       }
//       console.log(keyArray);
//       func(keyArray);
//     }
//   });
// };

module.exports.list = (func) => {
  s3.listObjectsV2(s3params, function (err, data) {
    let keyArray = [];

    if (err) console.log(err, err.stack);
    else {
      let contents = data.Contents;

      // console.log(data.Contents);
      for (let i = 0; i < contents.length; i++) {
        const signedParams = {
          Bucket: BUCKET_NAME,
          Key: contents[i].Key,
        };
        const url = s3.getSignedUrl("getObject", signedParams);
        keyArray.push(url);
        // keyArray.push(
        //   `https://${BUCKET_NAME}.s3.amazonaws.com/${contents[i].Key}`
        // );
        // keyArray.push(
        //   `https://s3.${region}.amazonaws.com/${BUCKET_NAME}/${contents[i].Key}`
        // );
      }
      console.log(keyArray);
      func(keyArray);
    }
  });
};

// var stream = aws.s3("eyeknow-data").getObject(s3Path).createReadStream();
// var proc = new ffmpeg(stream)
//   .outputOptions(["-movflags isml+frag_keyframe"])
//   .toFormat("mp4")
//   .withAudioCodec("copy")
//   //.seekInput(offset) this is a problem with piping
//   .on("error", function (err, stdout, stderr) {
//     console.log("an error happened: " + err.message);
//     console.log("ffmpeg stdout: " + stdout);
//     console.log("ffmpeg stderr: " + stderr);
//   })
//   .on("end", function () {
//     console.log("Processing finished !");
//   })
//   .on("progress", function (progress) {
//     console.log("Processing: " + progress.percent + "% done");
//   })
//   .pipe(res, { end: true });
