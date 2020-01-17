const filenamify = require('filenamify');
const ytdl = require('ytdl-core');

module.exports = class LinkCache {
    constructor() {
        this.linkList = [];
    }

    addLink(url) {
        return new Promise(resolve => {
            if (!ytdl.validateURL(url)) return resolve(false);

            const videoId = ytdl.getURLVideoID(url);
            if (this.inList(videoId)) return resolve(false);

            ytdl.getInfo(videoId, (err, info) => {
                if (err) return resolve(false);

                const thumbnails = info.player_response.videoDetails.thumbnail.thumbnails;

                resolve(this.addInfos({
                    url: url,
                    videoId: videoId,
                    title: info.title,
                    titleSafe: filenamify(info.title),
                    formats: info.formats,
                    thumbnail: thumbnails[thumbnails.length - 1]
                }));
            });
        });
    }

    addInfos(infos) {
        if (this.inList(infos.videoId)) return false;

        this.linkList.push(infos);
        return true;
    }

    removeVid(videoId) {
        this.linkList = this.linkList.filter(item => item.videoId !== videoId);
    }

    inList(videoId) {
        return this.linkList.filter(item => item.videoId === videoId).length > 0;
    }

    getInfo(videoId) {
        const videoInfo = this.linkList.filter(item => item.videoId === videoId);
        return videoInfo.length > 0 ? videoInfo[0] : null;
    }

    getLinkList() {
        return this.linkList;
    }
}