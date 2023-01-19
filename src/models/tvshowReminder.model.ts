import mongoose from "mongoose";
import { TvShowDocument, tvShowSchema } from "./tvshow.models";
import { TvShowDetails } from "./tvshowDetails.models";
import { UserDocument } from "./user.model";

// Typescript Definitions:
export interface TvShowReminderRes {
  tvShowDetails: TvShowDetails | undefined,
  completed: boolean;
  currentSeason: number;
  currentEpisode: number;
  personalRating: number;
}

export interface TvShowReminderInput {
  user: UserDocument["_id"],
  tvShow: TvShowDocument,
  completed: boolean;
  currentSeason: number;
  currentEpisode: number;
  personalRating: number;
}

export interface TvShowReminderDocument extends TvShowReminderInput, mongoose.Document {
  createAt: Date;
  updateAt: Date;
}

// Schema Definition
const tvShowReminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tvShow: tvShowSchema,
    completed: { type: Boolean},
    currentSeason: {type: Number},
    currentEpisode:{type: Number},
    personalRating:{type: Number},
  },
  {
    timestamps: true,
  }
);

// Model Definition
const TvShowReminderModel = mongoose.model<TvShowReminderDocument>("TvShowReminder", tvShowReminderSchema);
export default TvShowReminderModel;
