import { z } from "zod";
import mongoose from "mongoose";

export const createPayload = {
  body: z.object({
    tvShow: z.object({
      _id: z.string({ required_error: "Id of the document is required." }),
      id: z
        .number({ required_error: "Id of the tv show is required." })
        .int()
        .nonnegative(),
      original_name: z.string({ required_error: "Original name is required." }),
    }),
    completed: z.boolean({
      required_error: "Completed is required.",
    }),
    currentSeason: z
      .number({
        required_error: "Current Season is required.",
      })
      .int()
      .nonnegative(),
    currentEpisode: z
      .number({
        required_error: "Current Episode is required.",
      })
      .int()
      .nonnegative(),
    personalRating: z
      .number({
        required_error: "Personal Rating is required.",
      })
      .int()
      .nonnegative()
      .max(5),
  }),
};

export const updatePayload = {
  body: z.object({
    completed: z.boolean({
      required_error: "Completed is required.",
    }),
    currentSeason: z
      .number({
        required_error: "Current Season is required.",
      })
      .int()
      .nonnegative(),
    currentEpisode: z
      .number({
        required_error: "Current Episode is required.",
      })
      .int()
      .nonnegative(),
    personalRating: z
      .number({
        required_error: "Personal Rating is required.",
      })
      .int()
      .nonnegative()
      .max(5),
  }),
};

export const params = {
  params: z.object({
    tvShowReminderid: z.string()
  }).refine((reminderId) => mongoose.isValidObjectId(reminderId.tvShowReminderid), {
    message: "Tv Show Reminder Id you pass is not a valid Mongo Object ID.",
    path: ["tvShowReminderid"],
  }),
};

export const createTvShowReminderSchema = z.object({
  ...createPayload,
});

export const deleteTvShowReminderSchema = z.object({
  ...params,
});

export const updateTvShowReminderSchema = z.object({
  ...updatePayload,
  ...params,
});

export type CreateTvShowReminderInput = z.TypeOf<typeof createTvShowReminderSchema>;
export type DeleteTvShowReminderInput = z.TypeOf<typeof deleteTvShowReminderSchema>;
export type UpdateTvShowReminderInput = z.TypeOf<typeof updateTvShowReminderSchema>;