import createServer from "../utils/server";
import supertest from "supertest";
import * as UserService from "../service/user.service";
import * as SessionService from "../service/session.service";
import { createSessionHandler } from "../controller/session.controller";

jest.setTimeout(70000);

const app = createServer();
const myAccessToken =
  "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2RkZDA0ZjBmMzE0OWZjOTZiZGQzMzMiLCJ1c2VybmFtZSI6IkpvYWNvIiwiZW1haWwiOiJqb2Fjb0Bob3RtYWlsLmNvbSIsIm5hbWUiOiJKb2FjbyIsImxhc3ROYW1lIjoiR29tZXoiLCJwYXNzd29yZCI6IiQyYiQxMCQyN2ZodFQ0R2gzSXljU2U4Vy8wdTllazUvVzVVOUVrLi42blJyQVhnU29KQ01UckQ2d3Q3RyIsImNyZWF0ZWRBdCI6IjIwMjMtMDItMDRUMDM6MjY6MDcuMTk5WiIsInVwZGF0ZWRBdCI6IjIwMjMtMDItMDRUMDM6MjY6MDcuMTk5WiIsIl9fdiI6MCwic2Vzc2lvbiI6IjYzZTE3Mjc3MTRhNmU4M2NhYjkwNWZkYyIsImlhdCI6MTY3NTcxOTI4OCwiZXhwIjoxNzA3Mjc2ODg4fQ.aoCzBItkPgON2X1YIk-tH-aJkYOMhDTzfqZXC7JNu7kwZbiaqv0yz1S8fZEPF3-WJH2fy5yajDLeSQnn8zqCyOvCJwhy3x89zV3Vs8Wg7vBjYz1PfWVP7jAg9_F5lIsJCdOb_SlrggglrybZMBg4RLpjLkUccqq6w8cjbX40yJkYXj5E5tLmF4ArR8mZMasNzE9gnr4hh09B_jxbd768FQjay-X-Q3TClBUF-nR1LTKQvqq9VR0AVToM-IH7fW44m2cqB7R_dWPaVOfpH5YsL50oqYOtXE0vjM4fqSYQQdHVpioGjsckqcWWGmCZHVgc_4Oot0fuO-fqb9SyzSwoPg";

const userId = "63ddd04f0f3149fc96bdd333";
const sessionId = "63e1727714a6e83cab905fdc";

const sessionPayload = {
  _id: sessionId,
  user: userId,
  valid: true,
  userAgent: "PostmanRuntime/7.29.2",
  createdAt: "2023-02-06T20:16:58.684Z",
  updatedAt: "2023-02-06T20:16:58.684Z",
  __v: 0,
};

const userPayload = {
  username: "Joaco",
  email: "joaco@hotmail.com",
  name: "Joaco",
  lastName: "Gomez",
  _id: "63ddd04f0f3149fc96bdd333",
  createdAt: "2023-02-04T03:26:07.199Z",
  updatedAt: "2023-02-04T03:26:07.199Z",
  __v: 0,
};

const userInput = {
  username: "Joaco",
  email: "joaco@hotmail.com",
  name: "Joaco",
  lastName: "Gomez",
  password: "joacogomez",
  passwordConfirmation: "joacogomez",
};

describe("user registration", () => {
  describe("given the username and password are valid", () => {
    it("should return a status code of 200 and the user payload", async () => {
      const createUserMock = jest
        .spyOn(UserService, "createUser")
        // @ts-ignore
        .mockReturnValue(userPayload);

      const { body, statusCode } = await supertest(app)
        .post("/api/users")
        .send(userInput);
      expect(statusCode).toBe(200);
      expect(body).toEqual(userPayload);
      expect(createUserMock).toHaveBeenCalledWith(userInput);
    });
  });

  describe("given the passwords do not match", () => {
    it("should return a status code of 400", async () => {
      const createUserMock = jest
        .spyOn(UserService, "createUser")
        // @ts-ignore
        .mockReturnValue(userPayload);

      const { statusCode } = await supertest(app)
        .post("/api/users")
        .send({ ...userInput, passwordConfirmation: "doesnotmatch" });
      expect(statusCode).toBe(400);
      expect(createUserMock).not.toHaveBeenCalled();
    });
  });

  describe("given the user service throws", () => {
    it("should return a 409", async () => {
      const createUserMock = jest
        .spyOn(UserService, "createUser")
        .mockRejectedValue(new Error("Error"));

      const { statusCode } = await supertest(app)
        .post("/api/users")
        .send(userInput);
      expect(statusCode).toBe(409);
      expect(createUserMock).toHaveBeenCalled();
    });
  });
});

describe("create a user session", () => {
  describe("given the username and password are valid", () => {
    it("should return a signed access token and refresh token", async () => {
      jest
        .spyOn(UserService, "validatePassword")
        // @ts-ignore
        .mockReturnValue(userPayload);

      jest
        .spyOn(SessionService, "createSession")
        // @ts-ignore
        .mockReturnValue(sessionPayload);

      const req = {
        get: () => {
          return "a user agent";
        },
        body: {
          email: "joaco@hotmail.com",
          password: "joacogomez",
        },
      };

      const send = jest.fn();
      const res = {
        send,
      };

      // @ts-ignore
      await createSessionHandler(req, res);
      expect(send).toHaveBeenCalledWith({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });

  describe("given the username and password are invalid", () => {
    it("should return a 401", async () => {
      const validatePasswordMock = jest
        .spyOn(UserService, "validatePassword")
        // @ts-ignore
        .mockReturnValue(false);

      const { statusCode } = await supertest(app)
        .post("/api/sessions")
        .send(userInput);
      expect(statusCode).toBe(401);
      expect(validatePasswordMock).toHaveBeenCalled();
    });
  });
});

describe("get user sessions", () => {
  describe("given the user has logged in", () => {
    it("should return status code of 200 and the user sessions", async () => {
      let sessions = [];
      sessions.push(sessionPayload);
      const findSessionMock = jest
        .spyOn(SessionService, "findSessions")
        // @ts-ignore
        .mockReturnValue(sessions);

      const { statusCode, body } = await supertest(app)
        .get("/api/sessions")
        .set({ Authorization: myAccessToken });
      expect(statusCode).toBe(200);
      expect(body[0]._id).toEqual(sessions[0]._id);
      expect(findSessionMock).toHaveBeenCalledWith({
        user: userId,
        valid: true,
      });
    });
  });
});

describe("delete user sessions", () => {
  it("should return status code of 200 and disable the session", async () => {
    const updateSessionMock = jest
      .spyOn(SessionService, "updateSession")
      // @ts-ignore
      .mockReturnValue({});

    const { statusCode } = await supertest(app)
      .delete("/api/sessions")
      .set({ Authorization: myAccessToken });
    expect(statusCode).toBe(200);
    expect(updateSessionMock).toHaveBeenCalledWith(
      { _id: sessionId },
      { valid: false }
    );
  });
});
