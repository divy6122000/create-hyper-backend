import { AuthService } from "../services/auth.service.js";
import { sendSuccess } from "../utils/responses.js";
import { Request, Response, NextFunction } from "express";

export class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password } = req.body;
            const user = await AuthService.register({ firstName, lastName, email, password });
            return sendSuccess(res, 201, "User registered successfully", user);
        } catch (error: any) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const { user, token } = await AuthService.login({ email, password });
            return sendSuccess(res, 200, "User logged in successfully", { user, token });
        } catch (error: any) {
            next(error);
        }
    }
    
    static async logout(req: Request, res: Response, next: NextFunction) {
        try {
            return sendSuccess(res, 200, "User logged out successfully");
        } catch (error: any) {
            next(error);
        }
    }
}
