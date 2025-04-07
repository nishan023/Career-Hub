import * as jwt from "jsonwebtoken";
import { UserJWTPayload } from "../types";

export const createAccessToken = (payload: UserJWTPayload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1hr",
  });
};

export const createRefreshToken = (payload: UserJWTPayload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = (accessToken: string) => {
  return jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET as string);
};

export const verifyRefreshToken = (refreshToken: string) => {
  return jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET as string
  );
};