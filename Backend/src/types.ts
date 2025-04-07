import { Request } from "express";

export interface RequestWithUserObject extends Request {
  user: UserJWTPayload;
}

export interface UserJWTPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

// Interface for Signup
export interface ISignupBody {
  email: string;
  password: string;
  username: string;
}

export interface ILoginBody {
  email: string;
  password: string;
}
