const {
    dialog
} = require('electron');
const ProgressBar = require('electron-progressbar');
const fs = require('fs');
const ytdl = require('ytdl-core');
const linkManager = require('./linkManager');

exports.downloadVid = (videoId) => {
    return new Promise((resolve) => {
        const videoInfo = linkManager.getInfo(videoId);
        const path = askPathVid(videoInfo);

        if (!path) return resolve();

        const video = ytdl(videoInfo.videoId, {
            filter: (format) => format.container === 'mp4'
        });

        video.pipe(fs.createWriteStream(path));
        video.on('response', (res) => {
            const totalSize = res.headers['content-length'];

            const progressBar = new ProgressBar({
                indeterminate: false,
                text: videoInfo.title,
                title: "Downloading video...",
                browserWindow: {
                    webPreferences: {
                        nodeIntegration: true
                    }
                }
            });

            progressBar.on('completed', () => progressBar.detail = 'The file has been downloaded')
                .on('progress', (value) => progressBar.detail = `Downloading ${value.toFixed(2)}% / ${progressBar.getOptions().maxValue}%`);

            res.on('data', (data) => progressBar.value += (data.length / totalSize) * 100);

            res.on('end', () => {
                progressBar.setCompleted();
                resolve();
            });
        });
    });
}

function askPathVid(videoInfo) {
    return dialog.showSaveDialogSync({
        title: "MDownloader : Path",
        defaultPath: videoInfo.titleSafe + ".mp4",
        buttonLabel: "Save here"
    });
}