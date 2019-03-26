"use strict";
exports.__esModule = true;
var crmController_1 = require("../controllers/crmController");
var Routes = /** @class */ (function () {
    function Routes() {
        this.contactController = new crmController_1.ContactController();
    }
    Routes.prototype.routes = function (app) {
        app.route('/Crawl')
            .get(function (req, res, next) {
            // middleware          
            if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
                res.status(401).send('You shall not pass!');
            }
            else {
                next();
            }
        }, this.contactController.getCrawl)
            .post(function (req, res, next) {
            if (req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e') {
                res.status(401).send('You shall not pass!');
            }
            else {
                next();
            }
        }, this.contactController.addNewCrawl);
    };
    return Routes;
}());
exports.Routes = Routes;
