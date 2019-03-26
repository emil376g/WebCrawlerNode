"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const CrawledWebsite_1 = require("./CrawledWebsite");
require("reflect-metadata");
let CrawlModel = class CrawlModel {
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn()
], CrawlModel.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.OneToMany(() => CrawledWebsite_1.CrawledWebsite, (crawledWebsite) => crawledWebsite.CrawlModel)
], CrawlModel.prototype, "CrawledWebsite", void 0);
CrawlModel = tslib_1.__decorate([
    typeorm_1.Entity()
], CrawlModel);
exports.CrawlModel = CrawlModel;
exports.default = CrawlModel;
//# sourceMappingURL=CrawlModel.js.map