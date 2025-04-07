import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { validate } from "../utils/validate";
import { loginSchema } from "../validator/loginvalidator";
import { signupSchema } from "../validator/signup.validator";
import { authenticateToken } from "../middleware/authenticate.middleware";

const router = Router();

// Admin authentication routes
router.post("/admin/login", validate(loginSchema), adminController.login);
router.post("/admin/signup", validate(signupSchema), adminController.signup);

export default router;
