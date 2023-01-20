import { FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import { TvShowDetails } from "../models/tvshowDetails.models";
import TvShowReminderModel, {
  TvShowReminderDocument,
  TvShowReminderInput,
  TvShowReminderRes,
} from "../models/tvshowReminder.model";
import { getTvShowDetails } from "./tvshowDetails.service";

export async function createTvShowReminder(
  userId: string,
  inputReminder: TvShowReminderInput
) {
  try {
    // First we check if there is not a reminder already created for the tv show
    await checkTvShowReminderExistence(inputReminder);

    // Save the reminder information in the DB.
    const tvShowReminder = await TvShowReminderModel.create({
      ...inputReminder,
      user: userId,
    });

    // Get the details of tv show.
    const tvShowDetails: TvShowDetails | undefined = await getTvShowDetails(
      inputReminder.tvShow.id
    );

    // Return reminder with tv show details.
    return {
      reminderId: tvShowReminder._id,
      tvShowDetails,
      completed: tvShowReminder.completed,
      currentSeason: tvShowReminder.currentSeason,
      currentEpisode: tvShowReminder.currentEpisode,
      personalRating: tvShowReminder.personalRating,
    };
  } catch (e: any) {
    throw new Error(e);
  }
}

//  Return all the reminders of the user.
export async function getTvShowsReminder(
  query: FilterQuery<TvShowReminderDocument>
) {
  let remindersRes: TvShowReminderRes[] = [];
  // Find all reminders of the user.
  const reminders: TvShowReminderDocument[] = await TvShowReminderModel.find(
    query
  ).lean();

  // I build the final response with the tv show details of each reminder.
  for (const reminder of reminders) {
    console.log(reminder);
    const tvShowDetails: TvShowDetails | undefined = await getTvShowDetails(
      reminder.tvShow.id
    );
    let tempReminder = {
      reminderId: reminder._id,
      tvShowDetails,
      completed: reminder.completed,
      currentSeason: reminder.currentSeason,
      currentEpisode: reminder.currentEpisode,
      personalRating: reminder.personalRating,
    };
    remindersRes.push(tempReminder);
  }

  return remindersRes;
}

// Update a single reminder and return the reminder updated!
export async function updateTvShowReminder(
  filterQuery: FilterQuery<TvShowReminderDocument>,
  update: UpdateQuery<TvShowReminderDocument>,
  options: QueryOptions
) {
  return await TvShowReminderModel.findOneAndUpdate(filterQuery, update, options);
}

// Deletes a single reminder
export async function deleteTvShowReminder(
  query: FilterQuery<TvShowReminderDocument>
) {
  return await TvShowReminderModel.deleteOne(query);
}

// Return a single reminder based on the filter query.
export async function findTvShowReminder(
  query: FilterQuery<TvShowReminderDocument>
) {
  return await TvShowReminderModel.findOne(query).lean();
}

// Check if a reminder already exists looking by the id of the tv show document.
export async function checkTvShowReminderExistence(
  inputReminder: TvShowReminderInput
) {
  const reminder = await findTvShowReminder({
    "tvShow._id": inputReminder.tvShow._id,
  });

  if (reminder) {
    throw new Error("Reminder already exists.");
  }
}
