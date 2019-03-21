"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const https = require("https");
require("reflect-metadata");
const fs = require("fs");
var path = require('path');
const PORT = 54321;
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './config') + '/key.pem'),
    cert: fs.readFileSync(path.join(__dirname, './config') + '/cert.pem')
};
https.createServer(httpsOptions, app_1.default).listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
//# sourceMappingURL=Server.js.map