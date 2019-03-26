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
class crawled1551862249135 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("CREATE TABLE `place_model` (`id` int NOT NULL AUTO_INCREMENT, `place` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
            yield queryRunner.query("CREATE TABLE `url` (`id` int NOT NULL AUTO_INCREMENT, `url` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
            yield queryRunner.query("CREATE TABLE `data_structure` (`id` int NOT NULL AUTO_INCREMENT, `DataStructure` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
            yield queryRunner.query("CREATE TABLE `crawl_class` (`id` int NOT NULL AUTO_INCREMENT, `crawlClass` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
            yield queryRunner.query("CREATE TABLE `crawl_model` (`id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB");
            yield queryRunner.query("CREATE TABLE `crawled_website` (`id` int NOT NULL AUTO_INCREMENT, `date` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `created_date` datetime NOT NULL, `placeId` int NULL, `urlId` int NULL, `datastructurId` int NULL, `crawlClassId` int NULL, `crawlModelId` int NULL, UNIQUE INDEX `REL_9fed43050aa46af4892623b5c9` (`placeId`), UNIQUE INDEX `REL_9daf7d611ad20f9ec267fd49a7` (`urlId`), UNIQUE INDEX `REL_e066bcf76e5cd93fc78291dda6` (`datastructurId`), UNIQUE INDEX `REL_ca4ed1c64094dac9f1da1b4428` (`crawlClassId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
            yield queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_9fed43050aa46af4892623b5c97` FOREIGN KEY (`placeId`) REFERENCES `place_model`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
            yield queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_9daf7d611ad20f9ec267fd49a79` FOREIGN KEY (`urlId`) REFERENCES `url`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
            yield queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_e066bcf76e5cd93fc78291dda65` FOREIGN KEY (`datastructurId`) REFERENCES `data_structure`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
            yield queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_ca4ed1c64094dac9f1da1b4428d` FOREIGN KEY (`crawlClassId`) REFERENCES `crawl_class`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
            yield queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_8b051063ff3fe05512af5e432fb` FOREIGN KEY (`crawlModelId`) REFERENCES `crawl_model`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
            yield queryRunner.query("CREATE TABLE `webcrawl`.`query-result-cache` (`id` int NOT NULL AUTO_INCREMENT, `identifier` varchar(255) NULL, `time` bigint NOT NULL, `duration` int NOT NULL, `query` text NOT NULL, `result` text NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query("DROP TABLE `webcrawl`.`query-result-cache`");
            yield queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_8b051063ff3fe05512af5e432fb`");
            yield queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_ca4ed1c64094dac9f1da1b4428d`");
            yield queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_e066bcf76e5cd93fc78291dda65`");
            yield queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_9daf7d611ad20f9ec267fd49a79`");
            yield queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_9fed43050aa46af4892623b5c97`");
            yield queryRunner.query("DROP INDEX `REL_ca4ed1c64094dac9f1da1b4428` ON `crawled_website`");
            yield queryRunner.query("DROP INDEX `REL_e066bcf76e5cd93fc78291dda6` ON `crawled_website`");
            yield queryRunner.query("DROP INDEX `REL_9daf7d611ad20f9ec267fd49a7` ON `crawled_website`");
            yield queryRunner.query("DROP INDEX `REL_9fed43050aa46af4892623b5c9` ON `crawled_website`");
            yield queryRunner.query("DROP TABLE `crawled_website`");
            yield queryRunner.query("DROP TABLE `crawl_model`");
            yield queryRunner.query("DROP TABLE `crawl_class`");
            yield queryRunner.query("DROP TABLE `data_structure`");
            yield queryRunner.query("DROP TABLE `url`");
            yield queryRunner.query("DROP TABLE `place_model`");
        });
    }
}
exports.crawled1551862249135 = crawled1551862249135;
//# sourceMappingURL=1551862249135-crawled.js.map