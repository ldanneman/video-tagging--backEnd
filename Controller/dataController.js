const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const videoList = require("../lib/aws");
const Raw_File = require("../Model/raw_file");
const Incident_File = require("../Model/incident_file");

const users = async (req, res) => {
  const usersData = await User.find().select("-password");
  res.send(usersData);
};

const updateUser = async (req, res) => {
  let facilitiesArray = req.body.facilities.split(",");
  let hashedPassword = "";
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(req.body.password, salt);
  }
  try {
    User.updateOne(
      { _id: req.body._id },
      {
        name: req.body.name,
        email: req.body.email,
        companyID: req.body.companyID,
        role: req.body.role,
        facilities: facilitiesArray,
        ...(req.body.password && { password: hashedPassword }),
      },
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
};

const deleteUser = async (req, res) => {
  try {
    User.findByIdAndDelete(req.body._id, function (err) {
      if (err) console.log(err);
      console.log("Successful deletion");
      res.send("Successful deletion");
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const getVideos = (req, res, next) => {
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
};

const getEntities = async (req, res, next) => {
  let videos = videoList.fullList(async (videoURLs) => {
    try {
      res.send(videoURLs);
    } catch (err) {
      console.log(err);
      res.status(403).send(err, "there was an err");
    }
  });
};

module.exports = {
  users,
  updateUser,
  deleteUser,
  getVideos,
  getEntities,
};
