import { logger } from "../utils/logger.ts";
import { sendError } from "../utils/responses.ts";
import jwt from "jsonwebtoken";
import { config } from "../config/index.ts";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error: any) {
        logger.error("Auth middleware error:", error);
        return sendError(res, 401, "Unauthorized");
    }
};