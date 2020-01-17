const {
    app,
    BrowserWindow,
    dialog
} = require('electron');
const config = require("../config.json");
var win;

global.__basedir = __dirname;

app.on('window-all-closed', () => app.quit());
app.on('ready', init);

function init() {
    require('./express')()
        .then(setupElectron)
        .catch(err => {
            console.error(err);

            if (err.info)
                dialog.showMessageBoxSync({
                    type: "error",
                    title: "Error",
                    message: "The application is already running on your computer"
                });

            app.quit();
        });
}

function setupElectron() {
    win = new BrowserWindow({
        show: false,
        icon: __basedir + "/logo.png",
        minWidth: 1024,
        minHeight: 576
    });

    win.loadURL('http://localhost:' + config.port + '/link/add');

    win.once('ready-to-show', () => {
        win.show();
        win.maximize();
        win.focus();
        win.setMenuBarVisibility(false);
    });

    win.on('closed', () => win = null);
}

exports.getWindow = () => {
    return win;
}