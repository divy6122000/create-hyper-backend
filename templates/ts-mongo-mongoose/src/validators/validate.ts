import { validationResult } from "express-validator";
import { sendError } from "../utils/responses.ts";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
        return next();
    }
    const extractedErrors = error.array().map((err: ValidationError) => err.msg);
    return sendError(res, 422, extractedErrors[0], extractedErrors);
};