import { PlaceModel, Url, DataStructure, crawlClass } from './DetailedModel';
import 'reflect-metadata';
import { CrawlModel } from './CrawlModel';
export declare class CrawledWebsite {
    id: number;
    date: string;
    place: PlaceModel;
    title: string;
    description: string;
    url: Url;
    datastructur: DataStructure;
    crawlClass: crawlClass;
    CrawlModel: CrawlModel;
    created_date: Date;
}
export default CrawledWebsite;
