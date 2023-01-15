import { Express, Request, Response } from "express";
import { createSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { getTvShowDetailsHandler } from "./controller/tvshowDetails.controller";
import { getTvShowsByNameHandler } from "./controller/tvshows.controller";
import { createUserHandler } from "./controller/user.controller";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
    app.get("/api/tvShows/:id/details", getTvShowDetailsHandler);
    app.get("/api/tvShows", getTvShowsByNameHandler)
    app.post("/api/users", validateResource(createUserSchema), createUserHandler);
    app.post("/api/sessions", validateResource(createSessionSchema), createSessionHandler);
    app.get("/api/sessions", getUserSessionHandler);
}

export default routes;
