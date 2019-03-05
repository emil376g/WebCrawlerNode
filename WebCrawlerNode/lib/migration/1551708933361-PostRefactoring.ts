import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1551708933361 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE todo (id int PRIMARY KEY NOT NULL, date varchar(255) NOT NULL, place varchar(255) NOT NULL,title varchar(255) NOT NULL,description varchar(255) NOT NULL,url varchar(255) NOT NULL,datastructur varchar(255) NOT NULL,crawlClass varchar(255) NOT NULL,created_date DateTime NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE todo`);
    }

}
