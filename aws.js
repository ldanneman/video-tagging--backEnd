var AwsS3 = require("aws-sdk/clients/s3");

const ACCESS_KEY_ID = "AKIA6OHOPCC5DWJXXO7O";
const SECRET_ACCESS_KEY = "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";
const BUCKET_NAME = "eyeknow-data";
const Prefix = "Test/";
const Delimiter = "/";
const region = "us-east-1";

const s3 = new AwsS3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  Bucket: BUCKET_NAME,
  Delimiter: Delimiter,
  Prefix: Prefix,
  region: region,
});

const s3params = {
  Bucket: BUCKET_NAME,
  Delimiter: Delimiter,
  Prefix: Prefix,
};

// s3.listObjectsV2(s3params, function (err, data) {
//   if (err) console.log(err, err.stack);
//   // an error occurred
//   else {
//     console.log(data.Contents[0].Key);
//     let contents = data.Contents;
//     let keyArray = [];
//     for (let i = 0; i < contents.length; i++) {
//       keyArray.push(
//         `https://${BUCKET_NAME}.s3.amazonaws.com/${contents[i].Key}`
//       );
//       //   keyArray.push(contents[i].Key);
//     }
//     console.log(keyArray);
//   } // successful response
// });

module.exports.list = (func) => {
  s3.listObjectsV2(s3params, function (err, data) {
    let keyArray = [];

    if (err) console.log(err, err.stack);
    // an error occurred
    else {
      //   console.log(data.Contents[0].Key);
      let contents = data.Contents;
      // let keyArray = [];
      for (let i = 0; i < contents.length; i++) {
        keyArray.push(
          `https://${BUCKET_NAME}.s3.amazonaws.com/${contents[i].Key}`
        );
      }
      console.log(keyArray);
      func(keyArray)
    }
  });
  
};

// module.exports.list = (params) => {
//   let promise = new Promise((resolve, reject) => {
//     s3.listObjectsV2(s3params, (err, data) => {
//       if (err) {
//         reject(err);
//         console.log(err);
//       }
//       resolve(data);

//       promise.then(
//         (result) => (
//            console.log("hello")
//         ), // shows "done!" after 1 second
//         (error) => console.log("ttt", error) // doesn't run
//       );

//       let contents = data.Contents;
//       let keyArray = [];
//       for (let i = 0; i < contents.length; i++) {
//         keyArray.push(
//           `https://${BUCKET_NAME}.s3.amazonaws.com/${contents[i].Key}`
//         );
//         //   keyArray.push(contents[i].Key);
//       }
//       return keyArray;
//     });
//   });
// };
