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
class Initialize1551709418552 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("CREATE TABLE `todo` (`id` int NOT NULL AUTO_INCREMENT, `date` varchar(255) NOT NULL, `place` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, `datastructur` varchar(255) NOT NULL, `crawlClass` varchar(255) NOT NULL, `created_date` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("DROP TABLE `todo`");
        });
    }
}
exports.Initialize1551709418552 = Initialize1551709418552;
//# sourceMappingURL=1551709418552-Initialize.js.map