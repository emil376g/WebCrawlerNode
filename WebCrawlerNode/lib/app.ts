// lib/app.ts
var routes = require('../routes/index');
var users = require('../routes/users');
import * as express from "express";
import * as bodyParser from "body-parser";
import puppeteer = require('puppeteer')
import { Routes } from "./routes/crmRoutes";
import * as mongoose from "mongoose";

// Create a new express application instance
class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl: string = 'mongodb://localhost/OperaData';

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    private mongoSetup(): void {
        mongoose.Promise = global.Promise;
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
        });        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

}


export default new App().app;
//let crawl = async () => {
//    const browser = await puppeteer.launch({ headless: true });
//    const page = await browser.newPage();
//    await page.goto('https://www.roh.org.uk/events');
//    await page.waitFor(6000);
//    const result = await page.evaluate(() => {
//        let crawlStarter = function (element: ChildNode): any[] {
//            let data: any[] = [];

//            data = recursiveCrawl(element, data);

//            return data;
//        }
//        let recursiveCrawl = function (element: ChildNode, data: any[]) {
//            if (element.hasChildNodes()) {
//                element.childNodes.forEach(function (child: ChildNode) {
//                    recursiveCrawl(child, data);
//                });
//            } else {
//                if (element.nodeType != 8) {
//                    data.push({value:element.textContent });
//                }
//            }
//            return data;
//        }

//        let data: any[] = [];
//        let elements = document.querySelectorAll('article');
//        console.log(elements)
//        elements.forEach(function (element) {
//            console.log(element.nodeName);
//            data.push(crawlStarter(element));
//        })
//        return data;
//    });
//    await browser.close();
//    return result;
//};
//crawl().then((result) => {
//    console.log(result);
//});
