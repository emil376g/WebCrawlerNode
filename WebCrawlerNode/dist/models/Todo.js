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
let Todo = class Todo {
    constructor() {
        this.date = '';
        this.place = '';
        this.title = '';
        this.description = '';
        this.url = '';
        this.datastructur = '';
        this.crawlClass = '';
        this.created_date = new Date();
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Todo.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Todo.prototype, "date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Todo.prototype, "place", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Todo.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Todo.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Todo.prototype, "url", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Todo.prototype, "datastructur", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Todo.prototype, "crawlClass", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Todo.prototype, "created_date", void 0);
Todo = __decorate([
    typeorm_1.Entity()
], Todo);
exports.Todo = Todo;
exports.default = Todo;
//# sourceMappingURL=Todo.js.map