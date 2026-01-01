import { Response } from "express";

export const sendSuccess = (res: Response, statusCode: number = 200, message: string = 'Success', data: any = null) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (res: Response, statusCode: number = 400, message: string = 'Bad Request', errors: any = null) => {
    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};