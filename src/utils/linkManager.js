const LinkCache = require('./LinkCache');
const cache = new LinkCache();

exports.addLink = (url) => {
    return cache.addLink(url);
}

exports.removeVid = (videoId) => {
    return cache.removeVid(videoId);
}

exports.getLinkList = () => {
    return cache.getLinkList().map(x => x); // Clone
}