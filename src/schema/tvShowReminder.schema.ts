import { z } from "zod";

export const createTvShowReminderSchema = z.object({
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
});


export const updateTvShowReminderSchema = z.object({
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
});




export const params = {
  params: z.object({
    tvShowReminderid: z.string({
      required_error: "TvShowReminder is required",
    }),
  }),
};


export const deleteTvShowReminderSchema = z.object({
  ...params,
});

export type DeleteTvShowReminderInput = z.TypeOf<typeof deleteTvShowReminderSchema>;