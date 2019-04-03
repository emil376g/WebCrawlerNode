"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const model = require("../models/crmModel");
const puppeteer = require("puppeteer");
let crawledPages = new Map();
let URL;
let browser;
const DEPTH = parseInt(process.env.DEPTH) || 30;
const maxDepth = DEPTH;
const Crawl = mongoose.model('CrawlData', model.default.WebsiteSchema);
class ContactController {
    addNewCrawl(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        Crawl.remove({ _id: req.params.contactId }, (err) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!' });
        });
    }
}
exports.ContactController = ContactController;
function crawl(url, selector) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        browser = yield puppeteer.launch({ headless: false });
        URL = url;
        let data = [];
        data = yield crawlStarter(selector);
        return data;
    });
}
function crawlStarter(selector) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let data = [];
        const root = { url: URL };
        selector = selector;
        data = yield recursiveCrawl(browser, root, selector, data);
        return data;
    });
}
function recursiveCrawl(browser, page, selector, data, depth = 0) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (depth > maxDepth) {
            return data;
        }
        if (crawledPages.has(page.url)) {
            console.log(`Reusing route: ${page.url}`);
            const item = crawledPages.get(page.url);
            page.title = item.title;
            page.img = item.img;
            page.children = item.children;
            page.children.forEach(c => {
                const item = crawledPages.get(c.url);
                c.title = item ? item.title : '';
                c.img = item ? item.img : null;
            });
            return data;
        }
        else {
            console.log(`Loading: ${page.url}`);
            const newPage = yield browser.newPage();
            yield newPage.goto(page.url, { waitUntil: 'networkidle2' });
            yield newPage.waitFor(5000);
            let result = yield newPage.evaluate((selectors) => {
                selectors = selectors;
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
                    data = crawlStarter(element);
                });
                return data;
            }, selector);
            data.push(result);
            let anchors = yield newPage.evaluate((selector) => {
                function collectAllSameOriginAnchorsDeep(selector, sameOrigin = true) {
                    const allElements = [];
                    console.log(allElements);
                    const findAllElements = function (nodes) {
                        for (let i = 0, el; el = nodes[i]; ++i) {
                            allElements.push(el);
                            if (el.shadowRoot) {
                                findAllElements(el.shadowRoot.querySelectorAll('*'));
                            }
                        }
                    };
                    findAllElements(document.querySelectorAll('*'));
                    const filtered = allElements
                        .filter(el => el.localName === 'a' && el.href)
                        .filter(el => el.href !== location.href)
                        .filter(el => {
                        if (sameOrigin) {
                            return new URL(location).origin === new URL(el.href).origin;
                        }
                        return true;
                    })
                        .map(a => a.href);
                    return Array.from(new Set(filtered));
                }
                return collectAllSameOriginAnchorsDeep(selector);
            }, selector);
            anchors = anchors.filter(a => a !== URL);
            page.title = yield newPage.evaluate('document.title');
            page.children = anchors.map(url => ({ url }));
            crawledPages.set(page.url, page);
            yield newPage.close();
        }
        for (const childPage of page.children) {
            yield recursiveCrawl(browser, childPage, selector, data, depth + 1);
        }
        crawledPages.clear();
        return data;
    });
}
//# sourceMappingURL=crmController.js.map