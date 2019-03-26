"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app_1 = require("./app");
const typeorm_1 = require("typeorm");
const https = require("https");
const CrawlModel_1 = require("./models/CrawlModel");
const CrawledWebsite_1 = require("./models/CrawledWebsite");
const DetailedModel_1 = require("./models/DetailedModel");
require("reflect-metadata");
const fs = require("fs");
var path = require('path');
const PORT = 54321;
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './config') + '/key.pem'),
    cert: fs.readFileSync(path.join(__dirname, './config') + '/cert.pem')
};
typeorm_1.createConnection({
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "webcrawl",
    entities: [
        CrawlModel_1.default,
        CrawledWebsite_1.default,
        DetailedModel_1.PlaceModel,
        DetailedModel_1.Url,
        DetailedModel_1.DataStructure,
        DetailedModel_1.crawlClass
    ],
    synchronize: true,
    logging: false
}).then(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
    https.createServer(httpsOptions, app_1.default).listen(PORT, () => {
        console.log('Express server listening on port ' + PORT);
    });
})).catch((error) => console.log(error));
//# sourceMappingURL=Server.js.map