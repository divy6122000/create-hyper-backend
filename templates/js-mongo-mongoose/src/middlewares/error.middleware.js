import { logger } from "../utils/logger.js";
import { sendError } from "../utils/responses.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return sendError(res, statusCode, message);
};
