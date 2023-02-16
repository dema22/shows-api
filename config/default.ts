import dotenv from "dotenv";
dotenv.config();

export default {
    APIKEYMOVIEDB: process.env.APIKEY_MOVIEDB,
    port: process.env.PORT,
    dbUri: process.env.MONGODB_URI,
    saltWorkFactor: 10,
    accessTokenTimeToLive: "15m",
    refreshTokenTimeToLive: "1y",
    publicKey: process.env.PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
};