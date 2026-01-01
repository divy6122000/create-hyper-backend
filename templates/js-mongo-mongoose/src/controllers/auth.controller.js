import { AuthService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/responses.js";

export class AuthController {
    static async register(req, res, next) {
        try {
            const { firstName, lastName, email, password } = req.body;
            const user = await AuthService.register({ firstName, lastName, email, password });
            return sendSuccess(res, 201, "User registered successfully", user);
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login({ email, password });
            return sendSuccess(res, 200, "User logged in successfully", { user, token });
        } catch (error) {
            next(error);
        }
    }
    
    static async logout(req, res, next) {
        try {
            return sendSuccess(res, 200, "User logged out successfully");
        } catch (error) {
            next(error);
        }
    }
}
