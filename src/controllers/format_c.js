const cacheManager = require('../utils/cacheManager');

exports.select = async function (req, res) {
    const format = req.body.format;
    if (!cacheManager.isValideFormat(format)) return sendRes(res, 400, {
        msg: "Invalid format"
    });

    cacheManager.setFormat(format);

    sendRes(res, 200, {
        msg: "Format set"
    });
}

function sendRes(res, code, content) {
    content.code = code;
    res.status(code).send(content);
}