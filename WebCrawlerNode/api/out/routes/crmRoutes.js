"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crmController_1 = require("../controllers/crmController");
class Routes {
    constructor() {
        this.contactController = new crmController_1.ContactController();
    }
    routes(app) {
        app.route('/Crawl')
            .get((req, res, next) => {
            if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
                res.status(401).send('You shall not pass!');
            }
            else {
                next();
            }
        }, this.contactController.getCrawl)
            .post((req, res, next) => {
            if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
                res.status(401).send('You shall not pass!');
            }
            else {
                next();
            }
        }, this.contactController.addNewCrawl);
        app.route('/*')
            .get((req, res) => {
            res.sendStatus(404);
        });
    }
}
exports.Routes = Routes;
//# sourceMappingURL=crmRoutes.js.map