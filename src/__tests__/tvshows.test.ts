import supertest from "supertest";
import createServer from "../utils/server";
import * as TvShowsService from "../service/tvshows.service";

const app = createServer();

const tvShowPayload = [
  {
    _id: "63bf15ecc82d69b948516ae9",
    id: 1399,
    original_name: "Game of Thrones",
    popularity: 533.449,
  },
  {
    _id: "63bf162bc82d69b948536c35",
    id: 206584,
    original_name: "Game of Thrones: The Iron Anniversary",
    popularity: 22.318,
  },
];

describe("tvShows", () => {
  describe("get tvshows by name route", () => {

    describe("given the tvshows does not exists", () => {
      it("should return a 204", async () => {
        const tvShowName = "The Sopranos";
        const tvShowsServiceMock = jest
          .spyOn(TvShowsService, "findTvShowsByName")
          // @ts-ignore
          .mockReturnValueOnce([]);

        const { statusCode } = await supertest(app).get(
          `/api/tvShows?tvShowName${tvShowName}`
        );

        expect(statusCode).toBe(204);
        expect(tvShowsServiceMock).toHaveBeenCalled();
      });
    });

    describe("given the tvshows does exists", () => {
      it("should return a 200 status and the tv show", async () => {
        const tvShowName = "Game of Thrones";
        const tvShowsServiceMock = jest
          .spyOn(TvShowsService, "findTvShowsByName")
          // @ts-ignore
          .mockReturnValueOnce(tvShowPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/tvShows?tvShowName=${tvShowName}`
        );
        expect(statusCode).toBe(200);
        expect(body[0]._id).toBe(tvShowPayload[0]._id);
        expect(body[1]._id).toBe(tvShowPayload[1]._id);
        expect(tvShowsServiceMock).toHaveBeenCalledWith(tvShowName);
      });
    });
    
  });
});
