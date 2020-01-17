const web = require("express")();
const hbs = require('express-hbs');
const bodyParser = require("body-parser");
const config = require("../config.json");
const path = require("path");

module.exports = () => {
    return new Promise((resolve, reject) => {
        web.use(bodyParser.json());

        hbs.registerHelper('ifcond', (v1, v2, options) => v1 === v2 ? options.fn(this) : options.inverse(this));

        web.engine('hbs', hbs.express4({
            partialsDir: path.join(__basedir, '/views/partials'),
            layoutsDir: path.join(__basedir, '/views/layouts'),
            defaultLayout: path.join(__basedir, "/views/layouts/main"),
        }));
        web.set('view engine', 'hbs');
        web.set('views', path.join(__basedir, '/views/pages'));

        web.use(require("./routes"));

        web.listen(config.port, resolve).on('error', (err) => reject({
            info: "Port occupé",
            err: err
        }));
    });
}