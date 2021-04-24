const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Model/user");
const { registerValidation, loginValidation } = require("../lib/validate");

const register = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error?.details[0]?.message);
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already exists");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    companyID: req.body.companyID,
    role: req.body.role ?? undefined,
    facilities: [req.body.facilities],
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
};

const login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error?.details[0]?.message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password is incorrect");
  //Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  //create and assign JWT
  const userInfo = [
    user._id,
    user.name,
    user.email,
    user.role,
    user.facilities,
    user.aws_access.Bucket,
    user.aws_access.Prefix,
    user.aws_access.Delimiter,
  ];
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send([token, userInfo]);
};

module.exports = {
  register,
  login,
};
