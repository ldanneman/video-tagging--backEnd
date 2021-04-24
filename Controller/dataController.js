const User = require("../Model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const users = async (req, res) => {
  const usersData = await User.find().select("-password");
  res.send(usersData);
};

const updateUser = async (req, res) => {
  console.log(req.body);
  let facilitiesArray = req.body.facilities.split(",");
  console.log(facilitiesArray);
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
  console.log(req.body);
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

module.exports = {
  users,
  updateUser,
  deleteUser,
};
