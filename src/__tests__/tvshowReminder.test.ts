import createServer from "../utils/server";
import supertest from "supertest";
import * as TvShowReminderService from "../service/tvShowReminder.service";

jest.setTimeout(30000);

const app = createServer();
const reminderId = "63e2b322eba9c17dc842e800";
const userId = "63ddd04f0f3149fc96bdd333";
const myAccessToken =
  "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2RkZDA0ZjBmMzE0OWZjOTZiZGQzMzMiLCJ1c2VybmFtZSI6IkpvYWNvIiwiZW1haWwiOiJqb2Fjb0Bob3RtYWlsLmNvbSIsIm5hbWUiOiJKb2FjbyIsImxhc3ROYW1lIjoiR29tZXoiLCJwYXNzd29yZCI6IiQyYiQxMCQyN2ZodFQ0R2gzSXljU2U4Vy8wdTllazUvVzVVOUVrLi42blJyQVhnU29KQ01UckQ2d3Q3RyIsImNyZWF0ZWRBdCI6IjIwMjMtMDItMDRUMDM6MjY6MDcuMTk5WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDItMDRUMDM6MjY6MDcuMTk5WiIsIl9fdiI6MCwic2Vzc2lvbiI6IjYzZTE3Mjc3MTRhNmU4M2NhYjkwNWZkYyIsImlhdCI6MTY3NTcxOTI4OCwiZXhwIjoxNzA3Mjc2ODg4fQ.aoCzBItkPgON2X1YIk-tH-aJkYOMhDTzfqZXC7JNu7kwZbiaqv0yz1S8fZEPF3-WJH2fy5yajDLeSQnn8zqCyOvCJwhy3x89zV3Vs8Wg7vBjYz1PfWVP7jAg9_F5lIsJCdOb_SlrggglrybZMBg4RLpjLkUccqq6w8cjbX40yJkYXj5E5tLmF4ArR8mZMasNzE9gnr4hh09B_jxbd768FQjay-X-Q3TClBUF-nR1LTKQvqq9VR0AVToM-IH7fW44m2cqB7R_dWPaVOfpH5YsL50oqYOtXE0vjM4fqSYQQdHVpioGjsckqcWWGmCZHVgc_4Oot0fuO-fqb9SyzSwoPg";
const page = "1";

const tvShowReminderInput = {
  tvShow: {
    _id: "63bf15ecc82d69b948516ae8",
    id: 1398,
    original_name: "The Sopranos",
  },
  completed: false,
  currentSeason: 9,
  currentEpisode: 90,
  personalRating: 2,
};

const tvShowDetails = {
  backdropPath:
    "https://image.tmdb.org/t/p/original/lNpkvX2s8LGB0mjGODMT4o6Up7j.jpg",
  episodeRunTime: [60, 50],
  genres: ["Drama"],
  name: "The Sopranos",
  numberOfEpisodes: 86,
  numberOfSeasons: 6,
  originalLanguage: "en",
  overview:
    "The story of New Jersey-based Italian-American mobster Tony Soprano and the difficulties he faces as he tries to balance the conflicting requirements of his home life and the criminal organization he heads. Those difficulties are often highlighted through his ongoing professional relationship with psychiatrist Jennifer Melfi. The show features Tony's family members and Mafia associates in prominent roles and story arcs, most notably his wife Carmela and his cousin and protégé Christopher Moltisanti.",
  posterPath:
    "https://image.tmdb.org/t/p/original/57okJJUBK0AaijxLh3RjNUaMvFI.jpg",
  status: "Ended",
  tagline: "There's no getting out.",
  type: "Scripted",
  trailersURL: ["https://www.youtube.com/embed/KMx4iFcozK0"],
};

const tvShowReminderPayload = {
  reminderId: reminderId,
  tvShowDetails: tvShowDetails,
  completed: false,
  currentSeason: 9,
  currentEpisode: 90,
  personalRating: 2,
};

const remindersPaginated = {
  pagination: {
    count: 1,
    pageCount: 1,
  },
  remindersResponse: [
    {
      reminderId: "63e2b322eba9c17dc842e800",
      tvShowDetails,
      completed: false,
      currentSeason: 9,
      currentEpisode: 90,
      personalRating: 2,
    },
  ],
};

const emptyReminders = {
  pagination: {
    count: 0,
    pageCount: 0,
  },
  remindersResponse: null,
};

const update = {
  completed: true,
  currentSeason: 1,
  currentEpisode: 1,
  personalRating: 1
};

describe("create tv show reminder", () => {
  describe("given a valid tv show reminder body", () => {
    it("should return a status code of 200 and the reminder payload", async () => {
      const createReminderMock = jest
        .spyOn(TvShowReminderService, "createTvShowReminder")
        // @ts-ignore
        .mockReturnValue(tvShowReminderPayload);

      const { body, statusCode } = await supertest(app)
        .post("/api/tvShows/reminder")
        .send(tvShowReminderInput)
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(200);
      expect(body).toEqual(tvShowReminderPayload);
      expect(createReminderMock).toHaveBeenCalledWith(
        userId,
        tvShowReminderInput
      );
    });
  });

  describe("given the reminder already exists", () => {
    it("should return a status code of 409", async () => {
      const createReminderMock = jest
        .spyOn(TvShowReminderService, "createTvShowReminder")
        // @ts-ignore
        .mockRejectedValue(new Error("Error: Reminder already exists."));

      const { statusCode } = await supertest(app)
        .post("/api/tvShows/reminder")
        .send(tvShowReminderInput)
        .set({ Authorization: myAccessToken });
      expect(statusCode).toBe(409);
      expect(createReminderMock).toHaveBeenCalled();
    });
  });

  describe("given the reminder service throws", () => {
    it("should return a status code of 404", async () => {
      const createReminderMock = jest
        .spyOn(TvShowReminderService, "createTvShowReminder")
        // @ts-ignore
        .mockRejectedValue(new Error("Error"));

      const { statusCode } = await supertest(app)
        .post("/api/tvShows/reminder")
        .send(tvShowReminderInput)
        .set({ Authorization: myAccessToken });
      expect(statusCode).toBe(404);
      expect(createReminderMock).toHaveBeenCalled();
    });
  });
});

describe("get tv show reminders", () => {
  describe("given the user has reminders", () => {
    it("should return a status code of 200 and the list of reminders", async () => {
      const getRemindersMock = jest
        .spyOn(TvShowReminderService, "getTvShowsReminders")
        // @ts-ignore
        .mockReturnValue(remindersPaginated);

      const { body, statusCode } = await supertest(app)
        .get("/api/tvShows/reminder")
        .query({ page })
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(200);
      expect(body).toEqual(remindersPaginated);
      expect(getRemindersMock).toHaveBeenCalledWith(page, { user: userId });
    });
  });

  describe("given the user has no reminders", () => {
    it("should return a status code of 200", async () => {
      const getRemindersMock = jest
        .spyOn(TvShowReminderService, "getTvShowsReminders")
        // @ts-ignore
        .mockReturnValue(emptyReminders);

      const { statusCode } = await supertest(app)
        .get("/api/tvShows/reminder")
        .query({ page })
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(200);
      expect(getRemindersMock).toHaveBeenCalledWith(page, { user: userId });
    });
  });

  describe("given the reminders service throws", () => {
    it("should return a status code of 404", async () => {
      const getRemindersMock = jest
        .spyOn(TvShowReminderService, "getTvShowsReminders")
        // @ts-ignore
        .mockRejectedValue(new Error("Error"));

      const { statusCode } = await supertest(app)
        .get("/api/tvShows/reminder")
        .query({ page })
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(404);
      expect(getRemindersMock).toHaveBeenCalled();
    });
  });
});

describe("delete tv show reminder", () => {
  describe("given the user wants to delete a single reminder", () => {
    it("should return a status code of 204", async () => {
      const findReminderMock = jest
        .spyOn(TvShowReminderService, "findTvShowReminder")
        // @ts-ignore
        .mockReturnValue({ _id: reminderId, user: userId });

      const deleteRimenderMock = jest
        .spyOn(TvShowReminderService, "deleteTvShowReminder")
        // @ts-ignore
        .mockReturnValue({});

      const { statusCode } = await supertest(app)
        .delete(`/api/tvShows/reminder/${reminderId}`)
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(204);
      expect(findReminderMock).toHaveBeenCalledWith({ _id: reminderId });
      expect(deleteRimenderMock).toHaveBeenCalledWith({ _id: reminderId });
    });
  });

  describe("given the reminder does not exits", () => {
    it("should return a status code of 200", async () => {
      const findReminderMock = jest
        .spyOn(TvShowReminderService, "findTvShowReminder")
        // @ts-ignore
        .mockReturnValue(undefined);

      const deleteRimenderMock = jest
        .spyOn(TvShowReminderService, "deleteTvShowReminder")
        // @ts-ignore
        .mockReturnValue({});

      const { statusCode } = await supertest(app)
        .delete(`/api/tvShows/reminder/${reminderId}`)
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(200);
      expect(findReminderMock).toHaveBeenCalled();
      expect(deleteRimenderMock).not.toHaveBeenCalled();
    });
  });

  describe("given the reminder does not belong to the requesting user", () => {
    it("should return a status code of 403", async () => {
      const findReminderMock = jest
        .spyOn(TvShowReminderService, "findTvShowReminder")
        // @ts-ignore
        .mockReturnValue({ _id: reminderId, user: "bonale" });

      const deleteRimenderMock = jest
        .spyOn(TvShowReminderService, "deleteTvShowReminder")
        // @ts-ignore
        .mockReturnValue({});

      const { statusCode } = await supertest(app)
        .delete(`/api/tvShows/reminder/${reminderId}`)
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(403);
      expect(findReminderMock).toHaveBeenCalledWith({ _id: reminderId });
      expect(deleteRimenderMock).not.toHaveBeenCalled();
    });
  });

  describe("given the reminder service throws", () => {
    it("should return a status code of 404", async () => {
      const findReminderMock = jest
        .spyOn(TvShowReminderService, "findTvShowReminder")
        // @ts-ignore
        .mockRejectedValue(new Error("Error"));

      const { statusCode } = await supertest(app)
        .delete(`/api/tvShows/reminder/${reminderId}`)
        .set({ Authorization: myAccessToken });
      expect(statusCode).toBe(404);
      expect(findReminderMock).toHaveBeenCalled();
    });
  });

});

describe("update tv show reminder", () => {
  describe("given the user wants to update a single reminder", () => {
    it("should return a status code of 200 and return the updated reminder", async () => {
      const findReminderMock = jest
        .spyOn(TvShowReminderService, "findTvShowReminder")
        // @ts-ignore
        .mockReturnValue({ _id: reminderId, user: userId});

      const updateReminderMock = jest
        .spyOn(TvShowReminderService, "updateTvShowReminder")
        // @ts-ignore
        .mockReturnValue({ _id: reminderId, user: userId });

      const { statusCode } = await supertest(app)
        .put(`/api/tvShows/reminder/${reminderId}`)
        .send(update)
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(200);
      expect(findReminderMock).toHaveBeenCalledWith({ _id: reminderId });
      expect(updateReminderMock).toHaveBeenCalledWith(
        { _id: reminderId },
        update,
        { new: true }
      );
    });
  });

  describe("given the reminder does not exists", () => {
    it("should return a status code of 200", async () => {
      const findReminderMock = jest
        .spyOn(TvShowReminderService, "findTvShowReminder")
        // @ts-ignore
        .mockReturnValue(undefined);

      const updateReminderMock = jest
        .spyOn(TvShowReminderService, "updateTvShowReminder")
        // @ts-ignore
        .mockReturnValue({});

      const { statusCode } = await supertest(app)
        .put(`/api/tvShows/reminder/${reminderId}`)
        .send(update)
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(200);
      expect(findReminderMock).toHaveBeenCalled();
      expect(updateReminderMock).not.toHaveBeenCalled();
    });
  });

  describe("given the reminder does not belong to the requested user", () => {
    it("should return a status code of 403", async () => {
      const findReminderMock = jest
        .spyOn(TvShowReminderService, "findTvShowReminder")
        // @ts-ignore
        .mockReturnValue({ _id: reminderId, user: "bonale" });

      const updateReminderMock = jest
        .spyOn(TvShowReminderService, "updateTvShowReminder")
        // @ts-ignore
        .mockReturnValue({});

      const { statusCode } = await supertest(app)
        .put(`/api/tvShows/reminder/${reminderId}`)
        .send(update)
        .set({ Authorization: myAccessToken });

      expect(statusCode).toBe(403);
      expect(findReminderMock).toHaveBeenCalledWith({ _id: reminderId });
      expect(updateReminderMock).not.toHaveBeenCalled();
    });
  });

  describe("given the reminder service throws", () => {
    it("should return a status code of 404", async () => {
      const findReminderMock = jest
        .spyOn(TvShowReminderService, "findTvShowReminder")
        // @ts-ignore
        .mockRejectedValue(new Error("Error"));

      const { statusCode } = await supertest(app)
        .put(`/api/tvShows/reminder/${reminderId}`)
        .send(update)
        .set({ Authorization: myAccessToken });
      expect(statusCode).toBe(404);
      expect(findReminderMock).toHaveBeenCalled();
    });
  });

});
