const router = require("express").Router();
const dataController = require("../Controller/dataController");
const auth = require("../lib/auth");

router.all("/users", auth.admin, dataController.users);
router.post("/updateuser", auth.admin, dataController.updateUser);
router.post("/delete-user", auth.admin, dataController.deleteUser);

module.exports = router;
