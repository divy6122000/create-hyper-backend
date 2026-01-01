import { logger } from "../utils/logger.js";
import { sendError } from "../utils/responses.js";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendError(res, 401, "Authorization header missing or invalid");
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, config.JWT_SECRET);
        logger.info("Auth middleware called", { decoded });
        
        req.user = decoded;
        next();
    } catch (error) {
        logger.error("Auth middleware error:", error);
        return sendError(res, 401, "Unauthorized");
    }
};