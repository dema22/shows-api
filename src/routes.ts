import { Express, Request, Response } from "express";
import { getTvShowDetailsHandler } from "./controller/tvshowDetails.controller";

function routes(app: Express) {
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
    app.get("/api/tvShows/details", getTvShowDetailsHandler);
}

export default routes;
