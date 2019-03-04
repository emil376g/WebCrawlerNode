import app from "./app";
import * as https from 'https';
import * as fs from 'fs';
var path = require('path');
const PORT = 54321;

const httpsOptions = {
    //key: fs.readFileSync('C:/Users/emil376g/source/repos/WebCrawlerNode/WebCrawlerNode/lib/config/key.pem'),
    //cert: fs.readFileSync('C:/Users/emil376g/source/repos/WebCrawlerNode/WebCrawlerNode/lib/config/cert.pem')
    key: fs.readFileSync(path.join(__dirname, './config') + '/key.pem'),
    cert: fs.readFileSync(path.join(__dirname, './config') + '/cert.pem')
}
https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})
