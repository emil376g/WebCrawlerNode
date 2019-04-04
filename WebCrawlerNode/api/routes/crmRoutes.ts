import { ContactController } from "../controllers/crmController"

export class Routes {
    public contactController = new ContactController();
    public routes(app): void {
        app.get('/crawl',this.contactController.getCrawl)
        app.post('/crawl',this.contactController.addNewCrawl)
    }
}