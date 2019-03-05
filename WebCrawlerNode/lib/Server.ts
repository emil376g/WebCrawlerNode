import app from "./app";
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as https from 'https';
import Todo from './models/Todo';
import * as fs from 'fs';
var path = require('path');
const PORT = 54321;

const httpsOptions = {
    //key: fs.readFileSync('C:/Users/emil376g/source/repos/WebCrawlerNode/WebCrawlerNode/lib/config/key.pem'),
    //cert: fs.readFileSync('C:/Users/emil376g/source/repos/WebCrawlerNode/WebCrawlerNode/lib/config/cert.pem')
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
        Todo
    ],
    synchronize: true,
    logging: false
}).then(async () => {
    https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log('Express server listening on port ' + PORT);
    })
    }).catch((error) => console.log(error));
