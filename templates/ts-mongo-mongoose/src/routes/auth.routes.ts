import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.ts";
import { validateCreateUser, validateLogin } from "../validators/user.validation.ts";
import { validate } from "../validators/validate.ts";
import { authMiddleware } from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/register", validateCreateUser, validate, AuthController.register);
router.post("/login", validateLogin, validate, AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
