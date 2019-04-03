"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var DetailedModel_1 = require("./DetailedModel");
require("reflect-metadata");
var CrawlModel_1 = require("./CrawlModel");
var CrawledWebsite = /** @class */ (function () {
    function CrawledWebsite() {
        this.date = '';
        this.title = '';
        this.description = '';
        this.created_date = new Date();
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], CrawledWebsite.prototype, "id");
    tslib_1.__decorate([
        typeorm_1.Column('text')
    ], CrawledWebsite.prototype, "date");
    tslib_1.__decorate([
        typeorm_1.OneToOne(function () { return DetailedModel_1.PlaceModel; }),
        typeorm_1.JoinColumn()
    ], CrawledWebsite.prototype, "place");
    tslib_1.__decorate([
        typeorm_1.Column('text')
    ], CrawledWebsite.prototype, "title");
    tslib_1.__decorate([
        typeorm_1.Column('text')
    ], CrawledWebsite.prototype, "description");
    tslib_1.__decorate([
        typeorm_1.OneToOne(function () { return DetailedModel_1.Url; }),
        typeorm_1.JoinColumn()
    ], CrawledWebsite.prototype, "url");
    tslib_1.__decorate([
        typeorm_1.OneToOne(function () { return DetailedModel_1.DataStructure; }),
        typeorm_1.JoinColumn()
    ], CrawledWebsite.prototype, "datastructur");
    tslib_1.__decorate([
        typeorm_1.OneToOne(function () { return DetailedModel_1.crawlClass; }),
        typeorm_1.JoinColumn()
    ], CrawledWebsite.prototype, "crawlClass");
    tslib_1.__decorate([
        typeorm_1.ManyToOne(function (type) { return CrawlModel_1.CrawlModel; }, function (crawlBase) { return crawlBase.CrawledWebsite; })
    ], CrawledWebsite.prototype, "CrawlModel");
    tslib_1.__decorate([
        typeorm_1.Column('date')
    ], CrawledWebsite.prototype, "created_date");
    CrawledWebsite = tslib_1.__decorate([
        typeorm_1.Entity()
    ], CrawledWebsite);
    return CrawledWebsite;
}());
exports.CrawledWebsite = CrawledWebsite;
exports["default"] = CrawledWebsite;
