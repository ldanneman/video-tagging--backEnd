const router = require("express").Router();
const taggingController = require("../Controller/taggingController");
const videoController = require("../Controller/videoController");
const auth = require("../lib/auth");

router.post("/download", auth.user, videoController.download);
router.get("/stream", videoController.stream);
router.post("/tag", taggingController.tag);

module.exports = router;
