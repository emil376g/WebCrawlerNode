"use strict";
var _this = this;
exports.__esModule = true;
var tslib_1 = require("tslib");
var app_1 = require("./app");
var typeorm_1 = require("typeorm");
var https = require("https");
var CrawlModel_1 = require("./models/CrawlModel");
var CrawledWebsite_1 = require("./models/CrawledWebsite");
var DetailedModel_1 = require("./models/DetailedModel");
require("reflect-metadata");
var fs = require("fs");
var path = require('path');
var PORT = 54321;
var httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './config') + '/key.pem'),
    cert: fs.readFileSync(path.join(__dirname, './config') + '/cert.pem')
};
typeorm_1.createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "webcrawl",
    entities: [
        CrawlModel_1["default"],
        CrawledWebsite_1["default"],
        DetailedModel_1.PlaceModel,
        DetailedModel_1.Url,
        DetailedModel_1.DataStructure,
        DetailedModel_1.crawlClass
    ],
    synchronize: true,
    logging: false
}).then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        https.createServer(httpsOptions, app_1["default"]).listen(PORT, function () {
            console.log('Express server listening on port ' + PORT);
        });
        return [2 /*return*/];
    });
}); })["catch"](function (error) { return console.log(error); });
