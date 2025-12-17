import { body } from "express-validator"

export const validateCreateUser = [
    body('firstName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('lastName').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

export const validateUpdateUser = [
    body('firstName').trim().optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('lastName').trim().optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().optional().normalizeEmail().withMessage('Valid email required'),
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
    body('confirmPassword').optional().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

export const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
];