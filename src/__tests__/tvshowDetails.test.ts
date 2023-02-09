import createServer from "../utils/server";
import supertest from "supertest";
import * as TvShowDetailsService from "../service/tvshowDetails.service";

const app = createServer();

const tvShowId = "1399";
const tvShowDetailsPayload = {
  backdropPath:
    "https://image.tmdb.org/t/p/original/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg",
  episodeRunTime: [60],
  genres: ["Sci-Fi & Fantasy", "Drama", "Action & Adventure"],
  name: "Game of Thrones",
  numberOfEpisodes: 73,
  numberOfSeasons: 8,
  originalLanguage: "en",
  overview:
    "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond.",
  posterPath:
    "https://image.tmdb.org/t/p/original/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg",
  status: "Ended",
  tagline: "Winter Is Coming",
  type: "Scripted",
  trailersURL: [
    "https://www.youtube.com/embed/bjqEWgDVPe0",
    "https://www.youtube.com/embed/BpJYNVhGf1s",
  ],
};

describe("get tv show details", () => {
  describe("given a valid id of a tv show", () => {
    it("should return a status code of 200 and the details of the tv show", async () => {
      const tvShowDetailsMock = jest
        .spyOn(TvShowDetailsService, "getTvShowDetails")
        // @ts-ignore
        .mockReturnValue(tvShowDetailsPayload);

      const { statusCode } = await supertest(app).get(
        `/api/tvShows/${tvShowId}/details`
      );

      expect(statusCode).toBe(200);
      expect(tvShowDetailsMock).toHaveBeenCalledWith(tvShowId);
    });
  });

  describe("given the tv show details throws", () => {
    it("should return a status code of 404", async () => {
      const tvShowDetailsMock = jest
        .spyOn(TvShowDetailsService, "getTvShowDetails")
        // @ts-ignore
        .mockRejectedValue(new Error("Error"));

      const { statusCode } = await supertest(app).get(
        `/api/tvShows/${tvShowId}/details`
      );

      expect(statusCode).toBe(404);
      expect(tvShowDetailsMock).toHaveBeenCalled();
    });
  });
});
