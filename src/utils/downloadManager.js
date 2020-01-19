const {
    dialog,
    shell
} = require('electron');
const ProgressBar = require('electron-progressbar');
const fs = require('fs');
const nodePath = require('path');
const ytdl = require('ytdl-core');

const cacheManager = require('./cacheManager');

exports.downloadVid = (videoId) => {
    return new Promise(async (resolve) => {
        const videoInfo = cacheManager.getInfo(videoId);
        const defaultFormat = cacheManager.getDefaultFormat();

        let path = askPathVid(videoInfo);
        if (!path) return resolve();
        
        path += '.' + defaultFormat.ext;

        await this.startDownloadVid(videoInfo, path, 1, 1);

        dialogDownloadEnd(nodePath.dirname(path), path, 1, false);
        resolve();
    });
}

exports.startDownloadVid = (videoInfo, path, nb, total) => {
    return new Promise((resolve) => {
        if (!path) return resolve();

        const defaultFormat = cacheManager.getDefaultFormat();

        const video = ytdl(videoInfo.videoId, {
            filter: defaultFormat.filter,
            quality: 'highest'
        });

        video.pipe(fs.createWriteStream(path));
        video.on('response', (res) => {
            const totalSize = res.headers['content-length'];

            const progressBar = new ProgressBar({
                indeterminate: false,
                text: videoInfo.title,
                title: `Downloading file ${nb}/${total}`,
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
        title: "MDownloader: Save as",
        defaultPath: videoInfo.titleSafe,
        buttonLabel: "Save here"
    });
}

exports.downloadAllVid = () => {
    return new Promise(async (resolve) => {
        const defaultFormat = cacheManager.getDefaultFormat();
        
        let path = askPathFolder();
        if (!path || !path.length) return resolve();
        path = path[0] += '\\';


        const videoList = cacheManager.getLinkList();
        const dlProms = [];

        for (let video of videoList) {
            const videoInfo = cacheManager.getInfo(video.videoId);
            dlProms.push(this.startDownloadVid(videoInfo, path + videoInfo.titleSafe + '.' + defaultFormat.ext, videoList.indexOf(video) + 1, videoList.length));
        }

        Promise.all(dlProms).then(() => dialogDownloadEnd(path, null, dlProms.length, true));
    });
}

function askPathFolder() {
    return dialog.showOpenDialogSync({
        title: "MDownloader: Save as",
        properties: ['openDirectory'],
        buttonLabel: "Choose this folder"
    });
}

function dialogDownloadEnd(pathFolder, pathFile, total, isDownloadAll) {
    const buttons = ['Ok', 'Open folder'];
    if (!isDownloadAll && pathFile) buttons.push('Open file');

    const options = {
        type: 'info',
        buttons: buttons,
        title: 'Download completed',
        message: `The file${total > 1 ? 's' : ''} (${total}) have been downloaded`
    };

    const indexSelect = dialog.showMessageBoxSync(options);

    if (indexSelect == 1) shell.openItem(pathFolder);
    else if (indexSelect == 2) shell.openItem(pathFile);
}