import { logger } from "../utils/logger.ts";
import { sendError } from "../utils/responses.ts";
import { ErrorRequestHandler } from "express";
import { Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: () => void) => {
    logger.error(err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return sendError(res, statusCode, message);
};
