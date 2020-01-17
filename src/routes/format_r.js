const router = require("express").Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});
const controller = require("../controllers/format_c");

router.post("/select", urlencodedParser, controller.select);

module.exports = router;