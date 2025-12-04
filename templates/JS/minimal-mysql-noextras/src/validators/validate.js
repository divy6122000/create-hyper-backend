const { validationResult } = require("express-validator");
export const validate = (req, res, next) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
        return next();
    }
    const extractedErrors = error.array().map(err => err.msg);
    return res.status(422).json({
        success: false,
        message: extractedErrors[0],
    });
};