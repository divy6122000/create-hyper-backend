import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateCreateUser, validateLogin } from "../validators/user.validation.js";
import { validate } from "../validators/validate.js";

const router = Router();

router.post("/register", validateCreateUser, validate, AuthController.register);
router.post("/login", validateLogin, validate, AuthController.login);

export default router;
