import { User } from "../models/user.model.js";
import { getUserByEmail, isUserExists } from "../config/queries.js";
import bcrypt from "bcryptjs";
import { insertRecord } from "@/config/database.js";

export class AuthService {
    static async register(data) {
        const exists = await isUserExists(data.email);
        if (exists) throw new Error("User already exists");

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await insertRecord("users", {
            ...data,
            password: hashedPassword,
        });
        return user;
    }

    static async login(data) {
        const user = await getUserByEmail(data.email);
        if (!user) throw new Error("User not found");
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error("Invalid password");
        return user;
    }
}
