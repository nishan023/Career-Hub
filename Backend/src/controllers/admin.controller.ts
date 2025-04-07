import { Request, Response, NextFunction } from "express";
import * as adminService from "../services/admin.service";
import { loginBodyDTO } from "../validator/loginvalidator";
import { signupBodyDTO } from "../validator/signup.validator";

// Admin login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminData = loginBodyDTO.parse(req.body);
    const { accessToken, refreshToken } = await adminService.login(adminData);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .json({
        success: true,
        message: "Admin logged in successfully",
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

// Admin signup - no token returned
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminData = signupBodyDTO.parse(req.body);
    const newAdmin = await adminService.signup(adminData);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully. Please login to continue.",
      data: {
        admin: {
          id: newAdmin.id,
          email: newAdmin.email,
          userName: newAdmin.userName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
