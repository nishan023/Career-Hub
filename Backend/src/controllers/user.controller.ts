import { Request, Response, NextFunction, } from "express";
import * as userService from "../services/user.service";
import { loginBodyDTO } from "../validator/loginvalidator";
import { signupBodyDTO } from "../validator/signup.validator";
import { RequestWithUserObject } from "../types";

// User login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = loginBodyDTO.parse(req.body);
    const { accessToken, refreshToken } = await userService.login(userData);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "User logged in successfully",
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

// User signup
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData = signupBodyDTO.parse(req.body);
    const newUser = await userService.signup(userData);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please login to continue.",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
export const getProfile = async (
  req:RequestWithUserObject,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get userId from the authenticated user object (set by authenticateToken middleware)
    const userId = req.user.userId;

    // Get the user profile
    const userProfile = await userService.getUserProfile(userId);

    res.json({
      success: true,
      message: "User profile retrieved successfully",
      data: { user: userProfile },
    });
  } catch (error) {
    next(error);
  }
};
