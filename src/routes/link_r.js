const router = require("express").Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});
const controller = require("../controllers/link_c");

router.get("/add", controller.add);
router.get("/list", controller.list);

router.post("/checkAdd", urlencodedParser, controller.checkAdd);

router.post("/download", urlencodedParser, controller.download);
router.post("/remove", urlencodedParser, controller.remove);

module.exports = router;