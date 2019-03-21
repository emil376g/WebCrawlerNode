"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mongoose = require("mongoose");
const crmModel_1 = require("../models/crmModel");
const puppeteer = require("puppeteer");
let crawledPages = new Map();
let URL;
let browser;
const DEPTH = parseInt(process.env.DEPTH) || 30;
const maxDepth = DEPTH;
const Crawl = mongoose.model('CrawlData', crmModel_1.WebsiteSchema);
class ContactController {
    addNewCrawl(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var jsonArray = [];
            for (var i = 0; i < req.body.length; i++) {
                jsonArray.push({ 'data': req.body[i].data });
            }
            var jsonobject = {
                data: jsonArray
            };
            let newContact = new Crawl(jsonobject);
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
            crawledPages = new Map();
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
            yield newPage.goto(page.url, { waitUntil: 'networkidle0' });
            yield newPage.waitFor(3000);
            let result = yield newPage.evaluate((selectors) => {
                var parse = require('pattern-parser');
                var patterns = [{
                        pattern: '/(([1-2][0-9])|([1-9])|(3[0-1])) (jan|feb|mar|apr|maj|jun|jul|aug|sep|opt|nov|dec)/g',
                        callback: function (rolls) {
                            console.log('I will order ' + rolls + ' of toilet paper');
                        }
                    },
                    {
                        pattern: 'Remind me to {string} tomorrow',
                        callback: function (reminder) {
                            console.log('I will remind you to ' + reminder + ' tomorrow at noon');
                        }
                    }];
                selectors = selectors;
                let crawlStarter = function (element) {
                    let data = [];
                    data = recursiveCrawl(element, data);
                    return data;
                };
                let recursiveCrawl = function (element, data) {
                    if (element.hasChildNodes()) {
                        parse(element.textContent, patterns);
                        element.childNodes.forEach(function (child) {
                            return recursiveCrawl(child, data);
                        });
                    }
                    else {
                        if (element.nodeType != 8 && element) {
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
            }, selector);
            data.push(result);
            console.log(data);
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
            return yield recursiveCrawl(browser, childPage, selector, data, depth + 1);
        }
        crawledPages = new Map();
        return data;
    });
}
//# sourceMappingURL=crmController.js.map