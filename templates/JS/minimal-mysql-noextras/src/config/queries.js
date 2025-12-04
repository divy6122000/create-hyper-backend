import { executeQuery } from "./database.js";

export const getUserByEmail = async (email) => {
    try {
        const user = await executeQuery("SELECT * FROM users WHERE email = ?", [email]);
        return user;
    } catch (error) {
        console.log(error);
    }
}

export const getUserById = async (id) => {
    try {
        const user = await executeQuery("SELECT * FROM users WHERE id = ?", [id]);
        return user;
    } catch (error) {
        console.log(error);
    }
}

export const isUserExists = async (email) => {
    try {
        const user = await executeQuery("SELECT id FROM users WHERE email = ?", [email]);
        return user.length > 0;
    } catch (error) {
        console.log(error);
    }
}