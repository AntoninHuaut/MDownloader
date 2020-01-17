const {
    dialog,
    shell
} = require('electron');
const ProgressBar = require('electron-progressbar');
const fs = require('fs');
const nodePath = require('path');
const ytdl = require('ytdl-core');

const linkManager = require('./linkManager');

exports.downloadVid = (videoId) => {
    return new Promise(async (resolve) => {
        const videoInfo = linkManager.getInfo(videoId);
        const path = askPathVid(videoInfo);

        await this.startDownloadVid(videoInfo, path, 1, 1);

        dialogDownloadEnd(nodePath.dirname(path), path, 1, false);
        resolve();
    });
}

exports.startDownloadVid = (videoInfo, path, nb, total) => {
    return new Promise((resolve) => {
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
                title: `Downloading video ${nb}/${total}`,
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
                progressBar.close();
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

exports.downloadAllVid = () => {
    return new Promise(async (resolve) => {
        let path = askPathFolder();
        if (!path || !path.length) return resolve();
        path = path[0] += '\\';

        const videoList = linkManager.getLinkList();
        const dlProms = [];

        for (let video of videoList) {
            const videoInfo = linkManager.getInfo(video.videoId);
            dlProms.push(this.startDownloadVid(videoInfo, path + videoInfo.titleSafe + '.mp4', videoList.indexOf(video) + 1, videoList.length));
        }

        Promise.all(dlProms).then(() => dialogDownloadEnd(path, null, dlProms.length, true));
    });
}

function askPathFolder() {
    return dialog.showOpenDialogSync({
        title: "MDownloader : Path",
        properties: ['openDirectory'],
        buttonLabel: "Choose this folder"
    });
}

function dialogDownloadEnd(pathFolder, pathFile, total, isDownloadAll) {
    const buttons = ['Ok', 'Open folder'];
    if (!isDownloadAll && pathFile) buttons.push('Open video');

    const options = {
        type: 'info',
        buttons: buttons,
        title: 'Download completed',
        message: `All ${total} video${total > 1 ? 's' : ''} have been downloaded`
    };

    const indexSelect = dialog.showMessageBoxSync(options);

    if (indexSelect == 1) shell.openItem(pathFolder);
    else if (indexSelect == 2) shell.openItem(pathFile);
}