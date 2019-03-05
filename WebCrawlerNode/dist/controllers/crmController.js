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
const typeorm_1 = require("typeorm");
const puppeteer = require('puppeteer');
const Todo_1 = require("../models/Todo");
let repository;
const initialize = () => {
    const connection = typeorm_1.getConnection();
    repository = connection.getRepository(Todo_1.default);
};
const Crawl = mongoose.model('CrawlData', crmModel_1.WebsiteSchema);
class ContactController {
    addNewCrawl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (repository === undefined) {
                initialize();
            }
            const todo = new Todo_1.default();
            todo.date = req.body[0].date;
            todo.title = req.body[0].title;
            todo.place = req.body[0].place;
            todo.url = req.body[0].url;
            todo.crawlClass = req.body[0].crawlClass;
            todo.datastructur = req.body[0].datastructur;
            todo.description = req.body[0].description;
            yield repository.save(todo);
            console.log(req.body);
            console.log(todo);
            let newContact = new Crawl({
                _id: new mongoose.Types.ObjectId(),
                date: req.body[0].date,
                place: req.body[0].place,
                title: req.body[0].title,
                description: req.body[0].description,
                url: req.body[0].url,
                datastructur: req.body[0].datastructur,
                crawlClass: req.body[0].crawlClass,
            });
            newContact.save((err, contact) => {
                if (err) {
                    res.send(err);
                }
                res.json(contact);
            });
        });
    }
    getCrawl(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(yield crawl(req.query['url'], req.query['selector']));
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
        const browser = yield puppeteer.launch({ headless: true });
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
                    if (element.nodeType != 8 && element.textContent.replace(/\s/g, "") != "") {
                        data.push(element.textContent);
                    }
                }
                return data;
            };
            let data = [];
            let elements = document.querySelectorAll(selectors);
            elements.forEach(function (element) {
                data.push(crawlStarter(element));
            });
            return data;
        }, selectors);
        yield browser.close();
        return result;
    });
}
;
//# sourceMappingURL=crmController.js.map