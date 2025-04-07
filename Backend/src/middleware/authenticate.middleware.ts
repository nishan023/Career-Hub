import Boom from "@hapi/boom";
import { Response, NextFunction } from "express";
import { RequestWithUserObject, UserJWTPayload } from "../types";
import { verifyAccessToken } from "../utils/token.utils";

export function authenticateToken(
  req: RequestWithUserObject,
  res: Response,
  next: NextFunction
) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    throw Boom.badRequest("Missing authentication token. User is not login.");
  }

  try {
    const decodedToken = verifyAccessToken(token);
    req.user = decodedToken as UserJWTPayload;

    next();
  } catch (error) {
    throw Boom.unauthorized("User is not logged in");
  }
}
