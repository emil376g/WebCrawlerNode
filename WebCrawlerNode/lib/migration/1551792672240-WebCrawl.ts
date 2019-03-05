import { MigrationInterface, QueryRunner } from "typeorm";

export class WebCrawl1551792672240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `place_model` (`id` int NOT NULL AUTO_INCREMENT, `place` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `url` (`id` int NOT NULL AUTO_INCREMENT, `url` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `data_structure` (`id` int NOT NULL AUTO_INCREMENT, `DataStructure` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crawl_class` (`id` int NOT NULL AUTO_INCREMENT, `crawlClass` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `crawled_website` (`id` int NOT NULL AUTO_INCREMENT, `date` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `created_date` datetime NOT NULL, `placeId` int NULL, `urlId` int NULL, `datastructurId` int NULL, `crawlClassId` int NULL, UNIQUE INDEX `REL_9fed43050aa46af4892623b5c9` (`placeId`), UNIQUE INDEX `REL_9daf7d611ad20f9ec267fd49a7` (`urlId`), UNIQUE INDEX `REL_e066bcf76e5cd93fc78291dda6` (`datastructurId`), UNIQUE INDEX `REL_ca4ed1c64094dac9f1da1b4428` (`crawlClassId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_9fed43050aa46af4892623b5c97` FOREIGN KEY (`placeId`) REFERENCES `place_model`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_9daf7d611ad20f9ec267fd49a79` FOREIGN KEY (`urlId`) REFERENCES `url`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_e066bcf76e5cd93fc78291dda65` FOREIGN KEY (`datastructurId`) REFERENCES `data_structure`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `crawled_website` ADD CONSTRAINT `FK_ca4ed1c64094dac9f1da1b4428d` FOREIGN KEY (`crawlClassId`) REFERENCES `crawl_class`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_ca4ed1c64094dac9f1da1b4428d`");
        await queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_e066bcf76e5cd93fc78291dda65`");
        await queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_9daf7d611ad20f9ec267fd49a79`");
        await queryRunner.query("ALTER TABLE `crawled_website` DROP FOREIGN KEY `FK_9fed43050aa46af4892623b5c97`");
        await queryRunner.query("DROP INDEX `REL_ca4ed1c64094dac9f1da1b4428` ON `crawled_website`");
        await queryRunner.query("DROP INDEX `REL_e066bcf76e5cd93fc78291dda6` ON `crawled_website`");
        await queryRunner.query("DROP INDEX `REL_9daf7d611ad20f9ec267fd49a7` ON `crawled_website`");
        await queryRunner.query("DROP INDEX `REL_9fed43050aa46af4892623b5c9` ON `crawled_website`");
        await queryRunner.query("DROP TABLE `crawled_website`");
        await queryRunner.query("DROP TABLE `crawl_class`");
        await queryRunner.query("DROP TABLE `data_structure`");
        await queryRunner.query("DROP TABLE `url`");
        await queryRunner.query("DROP TABLE `place_model`");
    }

}
