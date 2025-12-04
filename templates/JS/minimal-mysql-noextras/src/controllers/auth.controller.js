import { AuthService } from "../services/auth.service.js";

export class AuthController {
    static async register(req, res, next) {
        try {
            const { firstName, lastName, email, password } = req.body;
            const user = await AuthService.register({ firstName, lastName, email, password });
            res.status(201).json({ success: true, message: "User registered successfully", data: user });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const token = await AuthService.login({ email, password });
            res.status(200).json({ success: true, message: "User logged in successfully", data: token });
        } catch (error) {
            next(error);
        }
    }
}
