export const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (res, statusCode = 400, message = 'Bad Request', errors = null) => {
    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};