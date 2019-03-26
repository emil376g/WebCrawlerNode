"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const DetailedModel_1 = require("./DetailedModel");
require("reflect-metadata");
const CrawlModel_1 = require("./CrawlModel");
let CrawledWebsite = class CrawledWebsite {
    constructor() {
        this.date = '';
        this.title = '';
        this.description = '';
        this.created_date = new Date();
    }
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn()
], CrawledWebsite.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text')
], CrawledWebsite.prototype, "date", void 0);
tslib_1.__decorate([
    typeorm_1.OneToOne(() => DetailedModel_1.PlaceModel),
    typeorm_1.JoinColumn()
], CrawledWebsite.prototype, "place", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text')
], CrawledWebsite.prototype, "title", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text')
], CrawledWebsite.prototype, "description", void 0);
tslib_1.__decorate([
    typeorm_1.OneToOne(() => DetailedModel_1.Url),
    typeorm_1.JoinColumn()
], CrawledWebsite.prototype, "url", void 0);
tslib_1.__decorate([
    typeorm_1.OneToOne(() => DetailedModel_1.DataStructure),
    typeorm_1.JoinColumn()
], CrawledWebsite.prototype, "datastructur", void 0);
tslib_1.__decorate([
    typeorm_1.OneToOne(() => DetailedModel_1.crawlClass),
    typeorm_1.JoinColumn()
], CrawledWebsite.prototype, "crawlClass", void 0);
tslib_1.__decorate([
    typeorm_1.ManyToOne(type => CrawlModel_1.CrawlModel, crawlBase => crawlBase.CrawledWebsite)
], CrawledWebsite.prototype, "CrawlModel", void 0);
tslib_1.__decorate([
    typeorm_1.Column('date')
], CrawledWebsite.prototype, "created_date", void 0);
CrawledWebsite = tslib_1.__decorate([
    typeorm_1.Entity()
], CrawledWebsite);
exports.CrawledWebsite = CrawledWebsite;
exports.default = CrawledWebsite;
//# sourceMappingURL=CrawledWebsite.js.map