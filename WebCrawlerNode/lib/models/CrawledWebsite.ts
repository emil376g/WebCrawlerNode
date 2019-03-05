import { Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import * as detailed from './DetailedModel'
@Entity()
export class CrawledWebsite {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public date: string = '';

    @OneToOne(() => detailed.PlaceModel)
    @JoinColumn()
    public place: detailed.PlaceModel;

    @Column()
    public title: string = '';

    @Column()
    public description: string = '';

    @OneToOne(() => detailed.Url)
    @JoinColumn()
    public url: detailed.Url;

    @OneToOne(() => detailed.DataStructure)
    @JoinColumn()
    public datastructur: detailed.DataStructure;

    @OneToOne(() => detailed.crawlClass)
    @JoinColumn()
    public crawlClass: detailed.crawlClass;

    @Column()
    public created_date: Date = new Date();
}
export default CrawledWebsite;