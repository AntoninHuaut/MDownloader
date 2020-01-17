module.exports = class FormatCache {
    constructor() {
        this.formatList = [];

        this.addFormat("mp4", "mp4", "video");
        this.addFormat("mp4", "mp4_audio-only", "audioonly");

        this.setFormat('mp4');
    }

    addFormat(ext, name, filter) {
        this.formatList.push({
            ext: ext,
            name: name,
            filter: filter,
            opt: ''
        });
    }

    setFormat(newFormat) {
        this.formatList.filter(fmt => fmt.opt === 'selected').forEach(fmt => fmt.opt = '');

        const format = this.formatList.filter(fmt => fmt.name === newFormat)[0];
        format.opt = 'selected';
        this.defaultFormat = format;
    }

    getDefaultFormat() {
        return this.defaultFormat;
    }

    getFormatList() {
        return this.formatList;
    }
}