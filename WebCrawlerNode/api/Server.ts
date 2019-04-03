import app from './app';
// import { createConnection } from 'typeorm';
import * as https from 'https';
// import { PlaceModel, Url, DataStructure, crawlClass } from './models/DetailedModel';

import * as fs from 'fs';
import * as path from 'path';
const PORT = 65432;

    https.createServer(null ,app).listen(PORT, () => {
        console.log('Express server listening on port ' + PORT);
    })
