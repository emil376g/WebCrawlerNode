"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const https = require("https");
const fs = require("fs");
const path = require("path");
const PORT = 3000;
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './config') + '/key.pem'),
    cert: fs.readFileSync(path.join(__dirname, './config') + '/cert.pem')
};
https.createServer(httpsOptions, app_1.default).listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
});
//# sourceMappingURL=Server.js.map