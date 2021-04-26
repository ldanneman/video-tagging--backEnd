const router = require("express").Router();
const dataController = require("../Controller/dataController");
const auth = require("../lib/auth");

router.all("/users", auth.admin, dataController.users);
router.post("/updateuser", auth.admin, dataController.updateUser);
router.post("/delete-user", auth.admin, dataController.deleteUser);
router.post("/get-videos", auth.user, dataController.getVideos);
router.get("/get-entities", auth.admin, dataController.getEntities);

module.exports = router;
