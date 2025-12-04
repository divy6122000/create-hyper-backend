import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/hyper-backend",
    JWT_SECRET: process.env.JWT_SECRET || "supersecret",
    DB_HOST: process.env.DB_HOST || "localhost",
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PASSWORD || "password",
    DB_NAME: process.env.DB_NAME || "hyper-backend",
    DB_PORT: process.env.DB_PORT || 3306,
};
