const router = require("express").Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});

router.post("/", urlencodedParser, require("../controllers/externalURL_c"));

module.exports = router;