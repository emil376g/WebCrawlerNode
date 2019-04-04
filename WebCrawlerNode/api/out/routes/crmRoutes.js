"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crmController_1 = require("../controllers/crmController");
class Routes {
    constructor() {
        this.contactController = new crmController_1.ContactController();
    }
    routes(app) {
        app.get('/crawl', this.contactController.getCrawl);
        app.post('/crawl', this.contactController.addNewCrawl);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=crmRoutes.js.map