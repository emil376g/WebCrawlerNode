"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
let PlaceModel = class PlaceModel {
    constructor() {
        this.place = '';
    }
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn()
], PlaceModel.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text')
], PlaceModel.prototype, "place", void 0);
PlaceModel = tslib_1.__decorate([
    typeorm_1.Entity()
], PlaceModel);
exports.PlaceModel = PlaceModel;
let Url = class Url {
    constructor() {
        this.url = '';
    }
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn()
], Url.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text')
], Url.prototype, "url", void 0);
Url = tslib_1.__decorate([
    typeorm_1.Entity()
], Url);
exports.Url = Url;
let DataStructure = class DataStructure {
    constructor() {
        this.DataStructure = '';
    }
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn()
], DataStructure.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text')
], DataStructure.prototype, "DataStructure", void 0);
DataStructure = tslib_1.__decorate([
    typeorm_1.Entity()
], DataStructure);
exports.DataStructure = DataStructure;
let crawlClass = class crawlClass {
    constructor() {
        this.crawlClass = '';
    }
};
tslib_1.__decorate([
    typeorm_1.PrimaryGeneratedColumn()
], crawlClass.prototype, "id", void 0);
tslib_1.__decorate([
    typeorm_1.Column('text')
], crawlClass.prototype, "crawlClass", void 0);
crawlClass = tslib_1.__decorate([
    typeorm_1.Entity()
], crawlClass);
exports.crawlClass = crawlClass;
exports.default = { PlaceModel, Url, DataStructure, crawlClass };
//# sourceMappingURL=DetailedModel.js.map