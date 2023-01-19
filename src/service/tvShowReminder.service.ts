import { FilterQuery } from "mongoose";
import { TvShowDetails } from "../models/tvshowDetails.models";
import TvShowReminderModel, { TvShowReminderDocument, TvShowReminderInput, TvShowReminderRes } from "../models/tvshowReminder.model";
import { getTvShowDetails } from "./tvshowDetails.service";


export async function createTvShowReminder(userId: string, inputReminder: TvShowReminderInput) {
  try {
    // Save the reminder information in the DB.
    const tvShowReminder = await TvShowReminderModel.create({...inputReminder, user: userId});

    // Get the details of tv show.
    const tvShowDetails : TvShowDetails | undefined = await getTvShowDetails(inputReminder.tvShow.id);
    
    // Return reminder with tv show details.
    return {
      tvShowDetails,
      completed: tvShowReminder.completed,
      currentSeason: tvShowReminder.currentSeason,
      currentEpisode: tvShowReminder.currentEpisode,
      personalRating: tvShowReminder.personalRating,
    }
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function getTvShowsReminder(query: FilterQuery<TvShowReminderDocument>) {
  let remindersRes : TvShowReminderRes[] = [];
  // Find all reminders of the user.
  const reminders : TvShowReminderDocument[] = await TvShowReminderModel.find(query).lean();
  
  // I build the final response with the tv show details of each reminder.
  for (const reminder of reminders) {
    console.log(reminder);
    const tvShowDetails: TvShowDetails | undefined = await getTvShowDetails(reminder.tvShow.id);
    let tempReminder = {
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