const FormatCache = require('./FormatCache');
const LinkCache = require('./LinkCache');

//-------------------------------------------
const cacheLink = new LinkCache();

exports.addLink = (url) => {
    return cacheLink.addLink(url);
}

exports.removeVid = (videoId) => {
    return cacheLink.removeVid(videoId);
}

exports.getInfo = (videoId) => {
    return cacheLink.getInfo(videoId);
}

exports.getLinkList = () => {
    return cacheLink.getLinkList().map(x => x); // Clone
}

//-------------------------------------------
const cacheFormat = new FormatCache();

exports.setFormat = (format) => {
    if (!this.isValideFormat(format)) return;

    cacheFormat.setFormat(format);
}

exports.isValideFormat = (format) => {
    return this.getFormatList().filter(fmt => fmt.name === format).length > 0;
}

exports.getDefaultFormat = () => {
    return cacheFormat.getDefaultFormat();
}

exports.getFormatList = () => {
    return cacheFormat.getFormatList().map(x => x); // Clone
}