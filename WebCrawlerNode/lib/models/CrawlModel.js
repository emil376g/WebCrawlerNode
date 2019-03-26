"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var CrawledWebsite_1 = require("./CrawledWebsite");
require("reflect-metadata");
var CrawlModel = /** @class */ (function () {
    function CrawlModel() {
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], CrawlModel.prototype, "id");
    tslib_1.__decorate([
        typeorm_1.OneToMany(function () { return CrawledWebsite_1.CrawledWebsite; }, function (crawledWebsite) { return crawledWebsite.CrawlModel; })
    ], CrawlModel.prototype, "CrawledWebsite");
    CrawlModel = tslib_1.__decorate([
        typeorm_1.Entity()
    ], CrawlModel);
    return CrawlModel;
}());
exports.CrawlModel = CrawlModel;
exports["default"] = CrawlModel;
