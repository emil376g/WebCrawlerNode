import app from "./app";
import * as https from 'https';
import 'reflect-metadata';

import * as fs from 'fs';
var path = require('path');
const PORT = 54321;
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './config') + '/key.pem'),
    cert: fs.readFileSync(path.join(__dirname, './config') + '/cert.pem')
}
https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})
