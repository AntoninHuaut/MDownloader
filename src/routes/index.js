const express = require("express");
const router = express.Router();

router.use("/", require("./base_r"));
router.use("/link", require("./link_r"));
router.use(express.static(__basedir + "/static"));

module.exports = router;