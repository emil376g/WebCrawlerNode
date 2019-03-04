"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/app.ts
var routes = require('../routes/index');
var users = require('../routes/users');
const express = require("express");
const bodyParser = require("body-parser");
const crmRoutes_1 = require("./routes/crmRoutes");
const mongoose = require("mongoose");
// Create a new express application instance
class App {
    constructor() {
        this.routePrv = new crmRoutes_1.Routes();
        this.mongoUrl = 'mongodb://localhost/OperaData';
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }
    config() {
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
}
exports.default = new App().app;
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
//# sourceMappingURL=app.js.map