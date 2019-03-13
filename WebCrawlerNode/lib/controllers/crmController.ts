﻿import * as mongoose from 'mongoose';
import { WebsiteSchema } from '../models/crmModel';
import { getConnection, Repository } from 'typeorm';
import { Request, Response } from 'express';
import * as puppeteer from 'puppeteer'
import * as model from '../models/CrawlModel';
let repository: Repository<model.CrawlModel>;
const crawledPages = new Map();
let URL;
let browser;
const DEPTH = parseInt(process.env.DEPTH) || 30;
const maxDepth = DEPTH; // Subpage depth to crawl site.
const initialize = () => {
    const connection = getConnection();
    repository = connection.getRepository(model.CrawlModel);
};
const Crawl = mongoose.model('CrawlData', WebsiteSchema);
export class ContactController {

    public async addNewCrawl(req: Request, res: Response) {
        if (repository === undefined) {
            initialize();
        }
        //mysql add
        //const crawlModelMySql = new model.CrawlModelMySql();
        //crawlModelMySql.date = req.body[0].date;
        //crawlModelMySql.title = req.body[0].title;
        //crawlModelMySql.place = req.body[0].place;
        //crawlModelMySql.url = req.body[0].url;
        //crawlModelMySql.crawlClass = req.body[0].crawlClass;
        //crawlModelMySql.datastructur = req.body[0].datastructur;
        //crawlModelMySql.description = req.body[0].description;
        //await repository.save(crawlModelMySql);
        //default i will go for is mongoDB
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
    }
    public async getCrawl(req: Request, res: Response) {
        res.json(await crawl(req.query['url'], req.query['selector']));
    }
    public getCrawlWithID(req: Request, res: Response) {
        Crawl.findById(req.params.contactId, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    public updateCrawl(req: Request, res: Response) {
        Crawl.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    } public deleteCrawl(req: Request, res: Response) {
        Crawl.remove({ _id: req.params.contactId }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!' + contact });
        });
    }
}
async function crawl(url: string, selector: string): Promise<any> {
    browser = await puppeteer.launch({ headless: true });
    URL = url;
    let data: any[] = [];
    data = await crawlStarter(selector)
    return data;
}

async function crawlStarter(selector): Promise<any[]> {
    let data: any[] = [];
    const root = { url: URL };
    selector = selector;
    data = await recursiveCrawl(browser, root, selector, data);
    return data;
}

async function recursiveCrawl(browser, page, selector, data: any[], depth = 0) {
    if (depth > maxDepth) {
        return data;
    }
    // If we've already crawled the URL, we know its children.
    if (crawledPages.has(page.url)) {
        console.log(`Reusing route: ${page.url}`);
        const item = crawledPages.get(page.url);
        page.title = item.title;
        page.img = item.img;
        page.children = item.children;
        // Fill in the children with details (if they already exist).
        page.children.forEach(c => {
            const item = crawledPages.get(c.url);
            c.title = item ? item.title : '';
            c.img = item ? item.img : null;
        });
        return data;
    } else {
        console.log(`Loading: ${page.url}`);

        const newPage = await browser.newPage();
        await newPage.goto(page.url, { waitUntil: 'networkidle2' });
        await newPage.waitFor(5000);
        let result = await newPage.evaluate((selectors) => {
            selectors = selectors;
            let crawlStarter = function (element: ChildNode): any[] {
                let data: any[] = [];

                data = recursiveCrawl(element, data);

                return data;
            }
            let recursiveCrawl = function (element: ChildNode, data: any[]) {
                if (element.hasChildNodes()) {
                    element.childNodes.forEach(function (child: ChildNode) {
                        recursiveCrawl(child, data);
                    });
                } else {
                    if (element.nodeType != 8 && element.textContent.replace(/\s/g, "") != "") {
                        data.push(element.textContent);
                    }
                }
                return data;
            }

            let data: any[] = [];
            let elements = document.querySelectorAll(selectors);
            elements.forEach(function (element) {
                data.push(crawlStarter(element));
            })
            return data;
        }, selector);
        data.push(result);
        console.log(result);
        let anchors = await newPage.evaluate((selector) => {
            function collectAllSameOriginAnchorsDeep(selector, sameOrigin = true) {
                const allElements = [];
                console.log(allElements);

                const findAllElements = function (nodes) {
                    for (let i = 0, el; el = nodes[i]; ++i) {
                        allElements.push(el);
                        // If the element has a shadow root, dig deeper.
                        if (el.shadowRoot) {
                            findAllElements(el.shadowRoot.querySelectorAll(selector));
                        }
                    }
                };
                findAllElements(document.querySelectorAll(selector));
                const filtered = allElements
                    .filter(el => el.localName === 'a' && el.href) // element is an anchor with an href.
                    .filter(el => el.href !== location.href) // link doesn't point to page's own URL.
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
        anchors = anchors.filter(a => a !== URL) // link doesn't point to start url of crawl.

        page.title = await newPage.evaluate('document.title');
        page.children = anchors.map(url => ({ url }));

        crawledPages.set(page.url, page); // cache it.
        await newPage.close();
    }
    for (const childPage of page.children) {
        return await recursiveCrawl(browser, childPage, selector, data, depth + 1);
    }
    return data;
}