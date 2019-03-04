"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const crmModel_1 = require("../models/crmModel");
const puppeteer = require('puppeteer');
const Crawl = mongoose.model('Website', crmModel_1.WebsiteSchema);
class ContactController {
    addNewCrawl(req, res) {
        let newCrawl = new Crawl(JSON.stringify(req.body), JSON.stringify(req['selector']));
        newCrawl.save((err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    getCrawl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield crawl(req.body['url'], req.body['selector']));
        });
    }
    getCrawlWithID(req, res) {
        Crawl.findById(req.params.contactId, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    updateCrawl(req, res) {
        Crawl.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    deleteCrawl(req, res) {
        Crawl.remove({ _id: req.params.contactId }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!' + contact });
        });
    }
}
exports.ContactController = ContactController;
function crawl(url, selector) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(selector);
        const selectors = selector;
        const browser = yield puppeteer.launch({ headless: false });
        const page = yield browser.newPage();
        yield page.goto(url);
        yield page.waitFor(6000);
        const result = yield page.evaluate((selectors) => {
            selectors = selectors;
            console.log(selectors);
            let crawlStarter = function (element) {
                let data = [];
                data = recursiveCrawl(element, data);
                return data;
            };
            let recursiveCrawl = function (element, data) {
                if (element.hasChildNodes()) {
                    element.childNodes.forEach(function (child) {
                        recursiveCrawl(child, data);
                    });
                }
                else {
                    if (element.nodeType != 8) {
                        data.push(element.textContent);
                    }
                }
                return data;
            };
            let data = [];
            let elements = document.querySelectorAll(selectors);
            elements.forEach(function (element) {
                data.push({ 'part': crawlStarter(element) });
            });
            return data;
        }, selectors);
        yield browser.close();
        return result;
    });
}
;
//# sourceMappingURL=crmController.js.map