import app from "./app";
import { createConnection } from 'typeorm';
import * as https from 'https';
import CrawlModel from './models/CrawlModel';
import CrawledWebsite from './models/CrawledWebsite';
import { PlaceModel, Url, DataStructure, crawlClass } from './models/DetailedModel';
import 'reflect-metadata';

import * as fs from 'fs';
var path = require('path');
const PORT = 54321;
const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './config') + '/key.pem'),
    cert: fs.readFileSync(path.join(__dirname, './config') + '/cert.pem')
}
createConnection({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "webcrawl",
    entities: [
        CrawlModel,
        CrawledWebsite,
        PlaceModel,
        Url,
        DataStructure,
        crawlClass
    ],
    synchronize: true,
    logging: false
}).then(async () => {
    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log('Express server listening on port ' + PORT);
    })
}).catch((error) => console.log(error));
