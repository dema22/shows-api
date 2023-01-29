import { Request, Response, NextFunction } from "express";
import { reIssueAccessToken } from "../service/session.service";
import { verifyJwt } from "../utils/jwt.utils";


const deserializeUser = async (req: Request, res: Response, next:NextFunction) => {
    // Grab the access token from the authorization header.
    const accessToken = req.get("Authorization")?.replace("Bearer ", "");

    // Grab the refresh token from the x-refresh header.
    const refreshToken = req.get("x-refresh");


    if(!accessToken) {
        return next();
    }

    // Verify the access token
    const {decoded, expired} = verifyJwt(accessToken);

    if (decoded) {
        // We attach the decoded token info.
        res.locals.user = decoded;
        return next();
    }

    // If the accesstoken has expired, and we have a refresh token: we want to Re Issue a new Access Token.
    // We set it on the response headers and decoded it so we can save it on res.locals.
    if(expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({refreshToken});
        if(!newAccessToken) {
            return res.status(403).send({message: "The was a problem creating a new access token with the given refresh token."});
        }
        if(newAccessToken) {
            res.setHeader("x-access-token", newAccessToken);
        }
        const result = verifyJwt(newAccessToken);
        res.locals.user = result.decoded;
        return next();
    }
    
    return next();
}
export default deserializeUser;