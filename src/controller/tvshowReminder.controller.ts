import { Request, Response } from "express";
import { createTvShowReminder, getTvShowsReminder } from "../service/tvShowReminder.service";

export async function createTvShowReminderHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id;
    const tvShowReminder = await createTvShowReminder(userId, req.body);
    return res.send(tvShowReminder);
  } catch (e: any) {
    console.error(e.message);
    return res
      .status(404)
      .send({ message: "Error trying to create a tv show reminder" });
  }
}

export async function getTvShowsReminderHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id;
    const tvShowReminder = await getTvShowsReminder({user: userId});
    return res.send(tvShowReminder);
  } catch (e: any) {
    console.error(e.message);
    return res
      .status(404)
      .send({ message: "Error trying to fetch tv show reminders" });
  }
}