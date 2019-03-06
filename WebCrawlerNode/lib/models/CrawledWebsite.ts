import { Column, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { PlaceModel, Url, DataStructure, crawlClass} from './DetailedModel'
import { CrawlModel } from './CrawlModel';
@Entity()
export class CrawledWebsite {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public date: string = '';

    @OneToOne(() => PlaceModel)
    @JoinColumn()
    public place: PlaceModel;

    @Column()
    public title: string = '';

    @Column()
    public description: string = '';

    @OneToOne(() => Url)
    @JoinColumn()
    public url: Url;

    @OneToOne(() => DataStructure)
    @JoinColumn()
    public datastructur: DataStructure;

    @OneToOne(() => crawlClass)
    @JoinColumn()
    public crawlClass: crawlClass;

    @ManyToOne(type => CrawlModel, crawlBase => crawlBase.CrawledWebsite)
    public CrawlModel: CrawlModel;


    @Column()
    public created_date: Date = new Date();
}
export default CrawledWebsite;