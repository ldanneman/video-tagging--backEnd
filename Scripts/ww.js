const fs = require("fs");

const path = require("path");
const folder = "./Scripts";

const getAllFiles = function (dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });
  console.log(arrayOfFiles);
  return arrayOfFiles;
};

getAllFiles(folder);
// var files = fs.readdirSync(folder);
// for (i in files) {
//   console.log(files[i] + [i]);
// }

// var EXTENSION = ".txt";

// var targetFiles = files.filter(function (file) {
//   return path.extname(file).toLowerCase() === EXTENSION;
// });

// console.log(targetFiles);
