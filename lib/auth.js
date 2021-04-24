const jwt = require("jsonwebtoken");
const User = require("../Model/user");

module.exports.user = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

module.exports.admin = async (req, res, next) => {
  const token = req.header("auth-token");

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  const admin = await User.findById(decoded._id);
  if (admin.role == 1) {
    //DON'T SEND RESPONSE HERE
    next();
  } else {
    res.status(401).send("Not and Admin");
  }
};
