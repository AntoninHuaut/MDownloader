const {
    shell
} = require('electron');

module.exports = async function (req, res) {
    const url = req.body.url;
    if (!url) return;

    shell.openExternal(url).catch(err => console.error(err));
}