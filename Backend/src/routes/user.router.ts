import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { validate } from "../utils/validate";
import { loginSchema } from "../validator/loginvalidator";
import { signupSchema } from "../validator/signup.validator";
import { authenticateToken } from "../middleware/authenticate.middleware";

const router = Router();

// User authentication routes
router.post("/user/login", validate(loginSchema), userController.login);
router.post("/user/signup", validate(signupSchema), userController.signup);
router.get("/user/profile/",authenticateToken,userController.getProfile);



export default router;
