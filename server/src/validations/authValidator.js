const { check, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
        });
    }
    next();
};

const registerRules = [
    check('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
    check('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validateRequest
];

const loginRules = [
    check('username')
        .trim()
        .notEmpty().withMessage('Username is required'),
    check('password')
        .trim()
        .notEmpty().withMessage('Password is required'),
    validateRequest
];

module.exports = {
    registerRules,
    loginRules
};
