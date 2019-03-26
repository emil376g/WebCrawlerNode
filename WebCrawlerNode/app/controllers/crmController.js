"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var mongoose = require("mongoose");
var crmModel_1 = require("../models/crmModel");
var typeorm_1 = require("typeorm");
var puppeteer = require("puppeteer");
var model = require("../models/CrawlModel");
var repository;
var crawledPages = new Map();
var URL;
var browser;
var DEPTH = parseInt(process.env.DEPTH) || 30;
var maxDepth = DEPTH; // Subpage depth to crawl site.
var initialize = function () {
    var connection = typeorm_1.getConnection();
    repository = connection.getRepository(model.CrawlModel);
};
var Crawl = mongoose.model('CrawlData', crmModel_1.WebsiteSchema);
var ContactController = /** @class */ (function () {
    function ContactController() {
    }
    ContactController.prototype.addNewCrawl = function (req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var newContact;
            return tslib_1.__generator(this, function (_a) {
                if (repository === undefined) {
                    initialize();
                }
                newContact = new Crawl({
                    _id: new mongoose.Types.ObjectId(),
                    date: req.body[0].date,
                    place: req.body[0].place,
                    title: req.body[0].title,
                    description: req.body[0].description,
                    url: req.body[0].url,
                    datastructur: req.body[0].datastructur,
                    crawlClass: req.body[0].crawlClass
                });
                newContact.save(function (err, contact) {
                    if (err) {
                        res.send(err);
                    }
                    res.json(contact);
                });
                return [2 /*return*/];
            });
        });
    };
    ContactController.prototype.getCrawl = function (req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = res).json;
                        return [4 /*yield*/, crawl(req.query['url'], req.query['selector'])];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    ContactController.prototype.getCrawlWithID = function (req, res) {
        Crawl.findById(req.params.contactId, function (err, contact) {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    };
    ContactController.prototype.updateCrawl = function (req, res) {
        Crawl.findOneAndUpdate({ _id: req.params.contactId }, req.body, { "new": true }, function (err, contact) {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    };
    ContactController.prototype.deleteCrawl = function (req, res) {
        Crawl.remove({ _id: req.params.contactId }, function (err, contact) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!' + contact });
        });
    };
    return ContactController;
}());
exports.ContactController = ContactController;
function crawl(url, selector) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var data, _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, puppeteer.launch({ headless: false })];
                case 1:
                    browser = _c.sent();
                    URL = url;
                    data = [];
                    //await page.goto(url, { waitUntil: 'networkidle0' });
                    //await page.waitFor(2000);
                    //const itemsList = await page.$('body'); // Using '.$' is the puppeteer equivalent of 'querySelector'
                    //const result: puppeteer.ElementHandle[] = await itemsList.$$(selector);
                    //result.forEach(async (element) => {
                    _b = (_a = data).push;
                    return [4 /*yield*/, crawlStarter(selector)];
                case 2:
                    //await page.goto(url, { waitUntil: 'networkidle0' });
                    //await page.waitFor(2000);
                    //const itemsList = await page.$('body'); // Using '.$' is the puppeteer equivalent of 'querySelector'
                    //const result: puppeteer.ElementHandle[] = await itemsList.$$(selector);
                    //result.forEach(async (element) => {
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}
function crawlStarter(selector) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var data, root;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = [];
                    root = { url: URL };
                    selector = selector;
                    return [4 /*yield*/, recursiveCrawl(browser, root, selector, data)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
function recursiveCrawl(browser, page, selector, data, depth) {
    if (depth === void 0) { depth = 0; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var item, newPage, _a, _b, anchors, _c, _i, _d, childPage;
        return tslib_1.__generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (depth > maxDepth) {
                        return [2 /*return*/, data];
                    }
                    if (!crawledPages.has(page.url)) return [3 /*break*/, 1];
                    console.log("Reusing route: " + page.url);
                    item = crawledPages.get(page.url);
                    page.title = item.title;
                    page.img = item.img;
                    page.children = item.children;
                    // Fill in the children with details (if they already exist).
                    page.children.forEach(function (c) {
                        var item = crawledPages.get(c.url);
                        c.title = item ? item.title : '';
                        c.img = item ? item.img : null;
                    });
                    return [2 /*return*/, data];
                case 1:
                    console.log("Loading: " + page.url);
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    newPage = _e.sent();
                    return [4 /*yield*/, newPage.goto(page.url, { waitUntil: 'networkidle2' })];
                case 3:
                    _e.sent();
                    newPage.waitFor(2000);
                    _b = (_a = data).push;
                    return [4 /*yield*/, newPage.evaluate(function (selectors) {
                            selectors = selectors;
                            var crawlStarter = function (element) {
                                var data = [];
                                data = recursiveCrawl(element, data);
                                return data;
                            };
                            var recursiveCrawl = function (element, data) {
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
                            var data = [];
                            var elements = document.querySelectorAll(selectors);
                            elements.forEach(function (element) {
                                data.push(crawlStarter(element));
                            });
                            return data;
                        }, selector)];
                case 4:
                    _b.apply(_a, [_e.sent()]);
                    return [4 /*yield*/, newPage.evaluate(function (selector) {
                            function collectAllSameOriginAnchorsDeep(selector, sameOrigin) {
                                if (sameOrigin === void 0) { sameOrigin = true; }
                                var allElements = [];
                                console.log(allElements);
                                var findAllElements = function (nodes) {
                                    for (var i = 0, el = void 0; el = nodes[i]; ++i) {
                                        allElements.push(el);
                                        // If the element has a shadow root, dig deeper.
                                        if (el.shadowRoot) {
                                            findAllElements(el.shadowRoot.querySelectorAll('*'));
                                        }
                                    }
                                };
                                findAllElements(document.querySelectorAll('*'));
                                var filtered = allElements
                                    .filter(function (el) { return el.localName === 'a' && el.href; }) // element is an anchor with an href.
                                    .filter(function (el) { return el.href !== location.href; }) // link doesn't point to page's own URL.
                                    .filter(function (el) {
                                    if (sameOrigin) {
                                        return new URL(location).origin === new URL(el.href).origin;
                                    }
                                    return true;
                                })
                                    .map(function (a) { return a.href; });
                                return Array.from(new Set(filtered));
                            }
                            (function () {
                                return collectAllSameOriginAnchorsDeep(selector);
                            });
                        }, selector)];
                case 5:
                    anchors = _e.sent();
                    anchors = anchors.filter(function (a) { return a !== URL; }); // link doesn't point to start url of crawl.
                    _c = page;
                    return [4 /*yield*/, newPage.evaluate('document.title')];
                case 6:
                    _c.title = _e.sent();
                    page.children = anchors.map(function (url) { return ({ url: url }); });
                    crawledPages.set(page.url, page); // cache it.
                    return [4 /*yield*/, newPage.close()];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _i = 0, _d = page.children;
                    _e.label = 9;
                case 9:
                    if (!(_i < _d.length)) return [3 /*break*/, 12];
                    childPage = _d[_i];
                    return [4 /*yield*/, recursiveCrawl(browser, childPage, selector, data, depth + 1)];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11:
                    _i++;
                    return [3 /*break*/, 9];
                case 12: return [2 /*return*/, data];
            }
        });
    });
}
/**
* Finds all anchors on the page, inclusive of those within shadow roots.
 *
* Note: Intended to be run in the context of the page.
* @param {boolean=} sameOrigin When true, only considers links from the same origin as the app.
* @return {!Array<string>} List of anchor hrefs.
*/
