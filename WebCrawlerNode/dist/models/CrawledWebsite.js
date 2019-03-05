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
const detailed = require("./DetailedModel");
let CrawledWebsite = class CrawledWebsite {
    constructor() {
        this.date = '';
        this.title = '';
        this.description = '';
        this.created_date = new Date();
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CrawledWebsite.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CrawledWebsite.prototype, "date", void 0);
__decorate([
    typeorm_1.OneToOne(() => detailed.PlaceModel),
    typeorm_1.JoinColumn(),
    __metadata("design:type", detailed.PlaceModel)
], CrawledWebsite.prototype, "place", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CrawledWebsite.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CrawledWebsite.prototype, "description", void 0);
__decorate([
    typeorm_1.OneToOne(() => detailed.Url),
    typeorm_1.JoinColumn(),
    __metadata("design:type", detailed.Url)
], CrawledWebsite.prototype, "url", void 0);
__decorate([
    typeorm_1.OneToOne(() => detailed.DataStructure),
    typeorm_1.JoinColumn(),
    __metadata("design:type", detailed.DataStructure)
], CrawledWebsite.prototype, "datastructur", void 0);
__decorate([
    typeorm_1.OneToOne(() => detailed.crawlClass),
    typeorm_1.JoinColumn(),
    __metadata("design:type", detailed.crawlClass)
], CrawledWebsite.prototype, "crawlClass", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], CrawledWebsite.prototype, "created_date", void 0);
CrawledWebsite = __decorate([
    typeorm_1.Entity()
], CrawledWebsite);
exports.CrawledWebsite = CrawledWebsite;
exports.default = CrawledWebsite;
//# sourceMappingURL=CrawledWebsite.js.map