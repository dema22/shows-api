import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>("privateKey");
const publicKey = config.get<string>("publicKey");

export function signJwt(
  payload: Object,
  options?: jwt.SignOptions | undefined
) {
  // sign our payload with our private key
  return jwt.sign(payload, privateKey, {
    ...(options && options), // spread options if it exist
    algorithm: "RS256",
  });
}

export function verifyJwt(token: string) {
    try {
        const decodedToken = jwt.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded: decodedToken
        };
    } catch (e: any) {
        return {
            valid: false,
            expired: e.message === 'jwt expired',
            decoded: null
        };
    }
}
