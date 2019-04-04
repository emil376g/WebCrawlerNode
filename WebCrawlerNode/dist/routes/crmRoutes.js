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
                res.status(401).json({ 'error': 'You shall not pass!' });
            }
            else {
                next();
                res.status(200).json({ "message": "works" });
            }
        }, this.contactController.getCrawl)
            .post((req, res, next) => {
            if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
                res.status(401).json({ 'error': 'You shall not pass!' });
            }
            else {
                next();
            }
        }, this.contactController.addNewCrawl);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=crmRoutes.js.map