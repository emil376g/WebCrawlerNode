import * as mongoose from 'mongoose';
import { WebsiteSchema } from '../models/crmModel';
import { Request, Response } from 'express';
const puppeteer = require('puppeteer');

const Crawl = mongoose.model('CrawlData', WebsiteSchema);
export class ContactController {

    public addNewCrawl(req: Request, res: Response) {
        console.log(req.body);
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
    console.log(selector);
    const selectors = selector
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor(6000);
    const result = await page.evaluate((selectors) => {
        selectors = selectors;
        console.log(selectors)
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
    }, selectors);
    await browser.close();
    return result;
};
