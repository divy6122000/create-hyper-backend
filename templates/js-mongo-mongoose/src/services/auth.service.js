import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export class AuthService {
    static async register(data) {
        const exists = await User.findOne({ email: data.email });
        if (exists) throw new Error("User already exists");

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await User.create({
            ...data,
            password: hashedPassword,
        });
        return user;
    }

    static async login(data) {
        const user = await User.findOne({ email: data.email });
        if (!user) throw new Error("User not found");
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error("Invalid password");
        return user;
    }
}
