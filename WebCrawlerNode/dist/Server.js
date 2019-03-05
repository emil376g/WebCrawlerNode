"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const https = require("https");
const Todo_1 = require("./models/Todo");
const fs = require("fs");
var path = require('path');
const PORT = 54321;
const httpsOptions = {
    //key: fs.readFileSync('C:/Users/emil376g/source/repos/WebCrawlerNode/WebCrawlerNode/lib/config/key.pem'),
    //cert: fs.readFileSync('C:/Users/emil376g/source/repos/WebCrawlerNode/WebCrawlerNode/lib/config/cert.pem')
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
        Todo_1.default
    ],
    synchronize: true,
    logging: false
}).then(() => __awaiter(this, void 0, void 0, function* () {
    https.createServer(httpsOptions, app_1.default).listen(PORT, () => {
        console.log('Express server listening on port ' + PORT);
    });
})).catch((error) => console.log(error));
//# sourceMappingURL=Server.js.map