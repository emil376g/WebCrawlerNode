"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var PlaceModel = /** @class */ (function () {
    function PlaceModel() {
        this.place = '';
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], PlaceModel.prototype, "id");
    tslib_1.__decorate([
        typeorm_1.Column('text')
    ], PlaceModel.prototype, "place");
    PlaceModel = tslib_1.__decorate([
        typeorm_1.Entity()
    ], PlaceModel);
    return PlaceModel;
}());
exports.PlaceModel = PlaceModel;
var Url = /** @class */ (function () {
    function Url() {
        this.url = '';
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Url.prototype, "id");
    tslib_1.__decorate([
        typeorm_1.Column('text')
    ], Url.prototype, "url");
    Url = tslib_1.__decorate([
        typeorm_1.Entity()
    ], Url);
    return Url;
}());
exports.Url = Url;
var DataStructure = /** @class */ (function () {
    function DataStructure() {
        this.DataStructure = '';
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], DataStructure.prototype, "id");
    tslib_1.__decorate([
        typeorm_1.Column('text')
    ], DataStructure.prototype, "DataStructure");
    DataStructure = tslib_1.__decorate([
        typeorm_1.Entity()
    ], DataStructure);
    return DataStructure;
}());
exports.DataStructure = DataStructure;
var crawlClass = /** @class */ (function () {
    function crawlClass() {
        this.crawlClass = '';
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], crawlClass.prototype, "id");
    tslib_1.__decorate([
        typeorm_1.Column('text')
    ], crawlClass.prototype, "crawlClass");
    crawlClass = tslib_1.__decorate([
        typeorm_1.Entity()
    ], crawlClass);
    return crawlClass;
}());
exports.crawlClass = crawlClass;
exports["default"] = { PlaceModel: PlaceModel, Url: Url, DataStructure: DataStructure, crawlClass: crawlClass };
