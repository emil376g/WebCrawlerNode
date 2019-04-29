import * as mongoose from "mongoose";
import * as model from "../models/crmModel";
import { Request, Response } from "express";
import * as puppeteer from "puppeteer";
let crawledPages = new Map();
let URL;
let browser;
const DEPTH = 10;
const maxDepth: number = DEPTH; // Subpage depth to crawl site.
var selectors;
const Crawl = mongoose.model("CrawlData", model.default.WebsiteSchema);
export class ContactController {
  public async addNewCrawl(req: Request, res: Response) {
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
  public async getCrawl(req: Request, res: Response) {
    console.log(req.query["url"])
    res.send(await crawl(req.query["url"], req.query['selector']).catch((err) => {
        console.log(err);
    }));
    crawledPages.clear()
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
    Crawl.findOneAndUpdate(
      { _id: req.params.contactId },
      req.body,
      { new: true },
      (err, contact) => {
        if (err) {
          res.send(err);
        }
        res.json(contact);
      }
    );
  }
  public deleteCrawl(req: Request, res: Response) {
    Crawl.remove({ _id: req.params.contactId }, err => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Successfully deleted contact!" });
    });
  }
}
async function crawl(urls: string, selector: string): Promise<any> {
  browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  let data: any[] = [];

  // await urls.split(" ").forEach(async url => {
    URL = urls;
    let CrawlClass = await Crawl.find({url: URL}, 'crawlClass', async function(err, docs){

      })
      console.log(selector)
      selectors = CrawlClass[0] !== undefined ? CrawlClass[0]['crawlClass'] : selector;
      data = await crawlStarter(selectors)
    crawledPages.clear();
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
  if (depth >= maxDepth) {
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
      c.title = item ? item.title : "";
      c.img = item ? item.img : null;
    });
    return data;
  } else {
    console.log(selector)
    console.log(`loading route: ${page.url}`);
    const newPage = await browser.newPage();
    console.log("lets go to page "+ page.url)
    await newPage.goto(page.url, {
        waitUntil: 'networkidle0',
        timeout: 0})
        console.log("need to w8 waiting")

    await newPage.waitFor(3000);
    console.log("done waiting")
    var result = await newPage.evaluate(selectors => {
      selectors = selectors;
      let crawlStarter = function(element: ChildNode): any[] {
        let data: any[] = [];

        data = recursiveCrawl(element, data);

        return data;
      };
      let recursiveCrawl = function(element: ChildNode, data: any[]) {
        if (element.hasChildNodes()) {
          element.childNodes.forEach(function(child: ChildNode) {
            recursiveCrawl(child, data);

          });
        } else {
          if (element.nodeType != 8) {
            data.push(element.textContent);
          }
        }
        return data;
      };
      let data: any[] = [];
      let elements = document.querySelectorAll(selectors);
      elements.forEach(function(element) {
        data.push(crawlStarter(element));
      });
      return data; 
    }, selector);
    console.log(result)
    let anchors = await newPage.evaluate(selector => {
      function collectAllSameOriginAnchorsDeep(selector, sameOrigin = true) {
        const allElements = [];
        console.log(allElements);

        const findAllElements = function(nodes) {
          for (let i = 0, el; (el = nodes[i]); ++i) {
            allElements.push(el);
            // If the element has a shadow root, dig deeper.
            if (el.shadowRoot) {
              findAllElements(el.shadowRoot.querySelectorAll("*"));
            }
          }
        };
        findAllElements(document.querySelectorAll(selector));
        const filtered = allElements
          .filter(el => el.localName === "a" && el.href) // element is an anchor with an href.
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
    anchors = anchors.filter(a => a !== URL); // link doesn't point to start url of crawl.

    page.title = await newPage.evaluate("document.title");
    page.children = anchors.map(url => ({ url }));

    crawledPages.set(page.url, page); // cache it.
    await newPage.close();
  }
  for (const childPage of page.children) {
    await recursiveCrawl(browser, childPage, selector, result, depth++);
  }
  crawledPages.clear();
  return result;
}
