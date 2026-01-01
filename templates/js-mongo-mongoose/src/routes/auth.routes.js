import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateCreateUser, validateLogin } from "../validators/user.validation.js";
import { validate } from "../validators/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateCreateUser, validate, AuthController.register);
router.post("/login", validateLogin, validate, AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);

export default router;
