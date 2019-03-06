import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CrawledWebsite } from './CrawledWebsite'

@Entity()
export class CrawlModel {
    @PrimaryGeneratedColumn()
    public id: number;
    @OneToMany(() => CrawledWebsite, (crawledWebsite) => crawledWebsite.CrawlModel)
    public CrawledWebsite: CrawledWebsite[];
}

export default CrawlModel;
