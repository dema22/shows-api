import { Request, Response } from "express";
import config from "config";
import { createSession } from "../service/session.service";
import { validatePassword } from "../service/user.service";
import { signJwt } from "../utils/jwt.utils";

export async function createSessionHandler(req: Request, res: Response) {
  // Validate the users password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send({ message: "Invalid email or password" });
  }

  // Create a session
  const session = await createSession(user._id, req.get("user-agent") || "");

  // Create an access token
  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("accessTokenTimeToLive") } // 15 minutes
  );
  // Create a refresh token
  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.get("refreshTokenTimeToLive") } // 1year
  );
  // Return acess and refresh tokens
  return res.send({ accessToken, refreshToken });
}

export async function getUserSessionHandler(req: Request, res: Response) {
  
}
