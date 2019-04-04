import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./routes/crmRoutes";
import * as mongoose from "mongoose";
import "reflect-metadata";
// Create a new express application instance
 class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = 'mongodb://mongo:27017/api';

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    private mongoSetup(): void {
        (mongoose.Promise as any) = global.Promise
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });

    }
    private config(): void {
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
            next();
        });
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

}
export default new App().app;