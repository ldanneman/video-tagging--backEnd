const router = require("express").Router();
const authController = require("../Controller/authController");
const auth = require("../lib/auth");

router.post("/register", auth.admin, authController.register);
router.post("/login", authController.login);

module.exports = router;
