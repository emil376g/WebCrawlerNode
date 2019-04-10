"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const model = require("../models/crmModel");
const puppeteer = require("puppeteer");
let crawledPages = new Map();
let URL;
let browser;
const DEPTH = 10;
const maxDepth = DEPTH;
const Crawl = mongoose.model("CrawlData", model.default.WebsiteSchema);
class ContactController {
    async addNewCrawl(req, res) {
        let newContact = new Crawl({
            _id: new mongoose.Types.ObjectId(),
            date: req.body[0].date,
            category: req.body[0].category,
            place: req.body[0].place,
            title: req.body[0].title,
            description: req.body[0].description,
            url: req.body[0].url,
            datastructur: req.body[0].datastructur,
            crawlClass: req.body[0].crawlClass
        });
        newContact.save((err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    async getCrawl(req, res) {
        console.log(req.query["url"]);
        res.send(await crawl(req.query["url"]).catch((err) => {
            console.log(err);
        }));
        crawledPages.clear();
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
        Crawl.remove({ _id: req.params.contactId }, err => {
            if (err) {
                res.send(err);
            }
            res.json({ message: "Successfully deleted contact!" });
        });
    }
}
exports.ContactController = ContactController;
async function crawl(urls) {
    browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    let data = [];
    URL = urls;
    let selector = 'body';
    data = await crawlStarter(selector);
    crawledPages.clear();
    return data;
}
async function crawlStarter(selector) {
    let data = [];
    const root = { url: URL };
    selector = selector;
    data = await recursiveCrawl(browser, root, selector, data);
    return data;
}
async function recursiveCrawl(browser, page, selector, data, depth = 0) {
    if (depth >= maxDepth) {
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
            c.title = item ? item.title : "";
            c.img = item ? item.img : null;
        });
        return data;
    }
    else {
        console.log(`loading route: ${page.url}`);
        const newPage = await browser.newPage();
        console.log("lets go to page " + page.url);
        await newPage.goto(page.url, {
            waitUntil: 'networkidle0',
            timeout: 0
        });
        console.log("need to w8 waiting");
        await newPage.waitFor(3000);
        console.log("done waiting");
        var result = await newPage.evaluate(selectors => {
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
                data.push(crawlStarter(element));
            });
            return data;
        }, selector.split());
        let anchors = await newPage.evaluate(selector => {
            function collectAllSameOriginAnchorsDeep(selector, sameOrigin = true) {
                const allElements = [];
                console.log(allElements);
                const findAllElements = function (nodes) {
                    for (let i = 0, el; (el = nodes[i]); ++i) {
                        allElements.push(el);
                        if (el.shadowRoot) {
                            findAllElements(el.shadowRoot.querySelectorAll("*"));
                        }
                    }
                };
                findAllElements(document.querySelectorAll(selector));
                const filtered = allElements
                    .filter(el => el.localName === "a" && el.href)
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
        }, selector.split(" ")[0]);
        anchors = anchors.filter(a => a !== URL);
        page.title = await newPage.evaluate("document.title");
        page.children = anchors.map(url => ({ url }));
        crawledPages.set(page.url, page);
        await newPage.close();
    }
    for (const childPage of page.children) {
        return await recursiveCrawl(browser, childPage, selector, result, depth++);
    }
    crawledPages.clear();
    return result;
}
//# sourceMappingURL=crmController.js.map