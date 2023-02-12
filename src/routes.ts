import { Express, Request, Response } from "express";
import { createSessionHandler, deleteSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { getTvShowDetailsHandler } from "./controller/tvshowDetails.controller";
import { createTvShowReminderHandler, deleteTvShowsReminderHandler, getTvShowsReminderHandler, updateTvShowsReminderHandler } from "./controller/tvshowReminder.controller";
import { getTvShowsByNameHandler } from "./controller/tvshows.controller";
import { createUserHandler } from "./controller/user.controller";
import requireUser from "./middleware/requireUser";
import validateResource from "./middleware/validateResource";
import { createSessionSchema } from "./schema/session.schema";
import { getTvShowSchema } from "./schema/tvshow.schema";
import { createTvShowReminderSchema, deleteTvShowReminderSchema, getTvShowReminderSchema, updateTvShowReminderSchema } from "./schema/tvShowReminder.schema";
import { createUserSchema } from "./schema/user.schema";

function routes(app: Express) {
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
    // Tv Show Details routes
    app.get("/api/tvShows/:id/details", getTvShowDetailsHandler);
    // Tv Show routes
    app.get("/api/tvShows",  [validateResource(getTvShowSchema)], getTvShowsByNameHandler);
    // Tv Show reminders
    app.post("/api/tvShows/reminder", [requireUser, validateResource(createTvShowReminderSchema)], createTvShowReminderHandler);
    app.get("/api/tvShows/reminder", [requireUser, validateResource(getTvShowReminderSchema)], getTvShowsReminderHandler);
    app.delete("/api/tvShows/reminder/:tvShowReminderid", [requireUser,validateResource(deleteTvShowReminderSchema)], deleteTvShowsReminderHandler);
    app.put("/api/tvShows/reminder/:tvShowReminderid", [requireUser,validateResource(updateTvShowReminderSchema)], updateTvShowsReminderHandler);
    // User routes
    app.post("/api/users", validateResource(createUserSchema), createUserHandler);
    // Session routes
    app.post("/api/sessions", validateResource(createSessionSchema), createSessionHandler);
    app.get("/api/sessions", requireUser, getUserSessionHandler);
    app.delete("/api/sessions", requireUser, deleteSessionHandler);
}

export default routes;
