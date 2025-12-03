import { User } from "../models/user.model.js";

export class AuthService {
    static async register(data) {
        const exists = await User.findOne({ email: data.email });
        if (exists) throw new Error("User already exists");

        const user = await User.create(data);
        return user;
    }

    static async login(data) {
        const user = await User.findOne({ email: data.email });
        if (!user) throw new Error("Invalid credentials");

        // In a real app, compare password and generate JWT
        if (user.password !== data.password) throw new Error("Invalid credentials");

        return "fake-jwt-token";
    }
}
