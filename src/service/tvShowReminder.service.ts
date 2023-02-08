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
    await checkTvShowReminderExistence(userId, inputReminder);

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

//  Return all the reminders of the user with pagination.
export async function getTvShowsReminders(page: any, query: {}) {
  let remindersResponse: TvShowReminderRes[] = [];
  const ITEMS_PER_PAGE = 10;

  try {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const countPromise = TvShowReminderModel.countDocuments(query);
    const remindersPromise = TvShowReminderModel.find(query)
      .limit(ITEMS_PER_PAGE)
      .skip(skip);
    const [count, reminders] = await Promise.all([
      countPromise,
      remindersPromise,
    ]);
    const pageCount = Math.ceil(count / ITEMS_PER_PAGE); // Divide the number of items in the collection by the items per page, and weround this number up to the nearest integer.
    remindersResponse = await buildRemindersWithDetails(
      remindersResponse,
      reminders
    );

    return {
      pagination: {
        count,
        pageCount,
      },
      remindersResponse,
    };
  } catch (e: any) {
    console.error(e);
    throw new Error(e);
  }
}

async function buildRemindersWithDetails(
  remindersResponse: TvShowReminderRes[],
  reminders: TvShowReminderDocument[]
) {
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
    remindersResponse.push(tempReminder);
  }

  return remindersResponse;
}

// Update a single reminder and return the reminder updated.
export async function updateTvShowReminder(
  filterQuery: FilterQuery<TvShowReminderDocument>,
  update: UpdateQuery<TvShowReminderDocument>,
  options: QueryOptions
) {
  return await TvShowReminderModel.findOneAndUpdate(
    filterQuery,
    update,
    options
  );
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
  userId: string,
  inputReminder: TvShowReminderInput
) {
  const reminder = await findTvShowReminder({
    "tvShow._id": inputReminder.tvShow._id,
    "user": userId 
  });

  if (reminder) {
    throw new Error("Reminder already exists.");
  }
}
