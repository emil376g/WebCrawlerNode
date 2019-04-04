import { Request, Response } from "express";
export declare class ContactController {
    addNewCrawl(req: Request, res: Response): Promise<void>;
    getCrawl(req: Request, res: Response): Promise<void>;
    getCrawlWithID(req: Request, res: Response): void;
    updateCrawl(req: Request, res: Response): void;
    deleteCrawl(req: Request, res: Response): void;
}
