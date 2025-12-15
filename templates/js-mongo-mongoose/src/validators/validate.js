import { validationResult } from "express-validator";
import { sendError } from "../utils/responses.js";
export const validate = (req, res, next) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
        return next();
    }
    const extractedErrors = error.array().map(err => err.msg);
    return sendError(res, 422, extractedErrors[0],extractedErrors);
};