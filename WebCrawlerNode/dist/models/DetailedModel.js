"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
let PlaceModel = class PlaceModel {
    constructor() {
        this.place = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PlaceModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], PlaceModel.prototype, "place", void 0);
PlaceModel = __decorate([
    typeorm_1.Entity()
], PlaceModel);
exports.PlaceModel = PlaceModel;
let Url = class Url {
    constructor() {
        this.url = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Url.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Url.prototype, "url", void 0);
Url = __decorate([
    typeorm_1.Entity()
], Url);
exports.Url = Url;
let DataStructure = class DataStructure {
    constructor() {
        this.DataStructure = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DataStructure.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DataStructure.prototype, "DataStructure", void 0);
DataStructure = __decorate([
    typeorm_1.Entity()
], DataStructure);
exports.DataStructure = DataStructure;
let crawlClass = class crawlClass {
    constructor() {
        this.crawlClass = '';
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], crawlClass.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], crawlClass.prototype, "crawlClass", void 0);
crawlClass = __decorate([
    typeorm_1.Entity()
], crawlClass);
exports.crawlClass = crawlClass;
exports.default = { PlaceModel, Url, DataStructure, crawlClass };
//# sourceMappingURL=DetailedModel.js.map