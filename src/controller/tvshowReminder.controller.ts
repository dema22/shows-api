import { Request, Response } from "express";
import { DeleteTvShowReminderInput } from "../schema/tvShowReminder.schema";
import {
  createTvShowReminder,
  deleteTvShowReminder,
  findTvShowReminder,
  getTvShowsReminder,
  updateTvShowReminder,
} from "../service/tvShowReminder.service";

export async function createTvShowReminderHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id;
    const tvShowReminder = await createTvShowReminder(userId, req.body);
    return res.send(tvShowReminder);
  } catch (e: any) {
    console.error(e.message);
    if (e.message === "Error: Reminder already exists.")
      return res.status(404).send({ message: e.message });

    return res
      .status(404)
      .send({ message: "Error trying to create a tv show reminder" });
  }
}

export async function getTvShowsReminderHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id;
    const tvShowReminder = await getTvShowsReminder({ user: userId });
    return res.send(tvShowReminder);
  } catch (e: any) {
    console.error(e.message);
    return res
      .status(404)
      .send({ message: "Error trying to fetch tv show reminders" });
  }
}

export async function deleteTvShowsReminderHandler(
  req: Request<DeleteTvShowReminderInput["params"]>,
  res: Response
) {
  try {
    const userId = res.locals.user._id;
    const tvShowReminderId = req.params.tvShowReminderid;

    const reminder = await findTvShowReminder({ _id: tvShowReminderId });

    // Reminder does not exits
    if (!reminder) {
      return res
        .status(404)
        .send({ message: "No reminder was found with that id." });
    }

    // check if the reminder i have belongs to the logged user
    if (userId !== String(reminder.user)) {
      return res
        .status(403)
        .send({ message: "You are not the owner of this reminder." });
    }

    await deleteTvShowReminder({ _id: tvShowReminderId });

    return res.sendStatus(200);
  } catch (e: any) {
    console.error(e.message);
    return res
      .status(404)
      .send({ message: "Error trying to delete the tv show reminder." });
  }
}

export async function updateTvShowsReminderHandler(
  req: Request,
  res: Response
) {
  try {
    const userId = res.locals.user._id;
    const tvShowReminderId = req.params.tvShowReminderid;
    const update = req.body;

    const reminder = await findTvShowReminder({ _id: tvShowReminderId });

    // Reminder does not exits
    if (!reminder) {
      return res
        .status(404)
        .send({ message: "No reminder was found with that id." });
    }

    // check if the reminder i have belongs to the logged user
    if (userId !== String(reminder.user)) {
      return res
        .status(403)
        .send({ message: "You are not the owner of this reminder." });
    }

    // Update the reminder with new info.
    const remainderUpdated = await updateTvShowReminder(
      { _id: tvShowReminderId },
      update,
      {
        new: true, // this option is so it return the updated reminder.
      }
    );

    return res.send(remainderUpdated);
  } catch (e: any) {
    console.error(e.message);
    return res
      .status(404)
      .send({ message: "Error trying to update the tv show reminder." });
  }
}
