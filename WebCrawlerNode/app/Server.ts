import app from './app';
// import { createConnection } from 'typeorm';
import * as https from 'https';
// import { PlaceModel, Url, DataStructure, crawlClass } from './models/DetailedModel';

import * as fs from 'fs';
import * as path from 'path';
const PORT = 3000;
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './config') + '/key.pem'),
    cert: fs.readFileSync(path.join(__dirname, './config') + '/cert.pem')
}

    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log('Express server listening on port ' + PORT);
    })
