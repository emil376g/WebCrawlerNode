import {Entity, Tree, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as CrawlClass from './CrawledWebsite'
@Entity()
export class CrawlModelMySql {
    @PrimaryGeneratedColumn()
    public id: number;
    @OneToMany(() => CrawlClass.CrawledWebsite, (crawledWebsite) => crawledWebsite.id)
    public CrawledWebsite: CrawlClass.CrawledWebsite[];
}

export default CrawlModelMySql;
