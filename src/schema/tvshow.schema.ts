import { object, string } from "zod";

export const getTvShowSchema = object({
  query: object({
    tvShowName: string({
      required_error: "Tv show name is required.",
    }),
  }),
});
