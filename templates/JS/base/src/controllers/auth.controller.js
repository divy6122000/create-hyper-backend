import { AuthService } from "../services/auth.service.js";

export class AuthController {
    static async register(req, res, next) {
        try {
            const user = await AuthService.register(req.body);
            res.status(201).json({ status: "success", data: user });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const token = await AuthService.login(req.body);
            res.status(200).json({ status: "success", token });
        } catch (error) {
            next(error);
        }
    }
}
