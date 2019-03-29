﻿import { Request, Response, NextFunction } from "express";
import { ContactController } from "../controllers/crmController";

export class Routes {
    public contactController: ContactController = new ContactController();
    public routes(app): void {
        app.route('/Crawl')
            .get((req: Request, res: Response, next: NextFunction) => {
                // middleware          
                if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
                    res.status(401).send('You shall not pass!');
                } else {
                    next();
                }
            }, this.contactController.getCrawl)
            .post((req: Request, res: Response, next: NextFunction) => {
                if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
                    res.status(401).send('You shall not pass!');
                } else {
                    next();
                }
            }, this.contactController.addNewCrawl)
    }
}