"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Todo_1 = require("./models/Todo");
let repository;
const initialize = () => {
    const connection = typeorm_1.getConnection();
    repository = connection.getRepository(Todo_1.default);
};
exports.createTodo = (_, res) => __awaiter(this, void 0, void 0, function* () {
    if (repository === undefined) {
        initialize();
    }
    const todo = new Todo_1.default();
    todo.name = 'A Todo';
    yield repository.save(todo);
    res.send(todo);
});
exports.readTodos = (_, res) => __awaiter(this, void 0, void 0, function* () {
    if (repository === undefined) {
        initialize();
    }
    const todos = yield repository.find();
    res.send(todos);
});
//# sourceMappingURL=todosManager.js.map