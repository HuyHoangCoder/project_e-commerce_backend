const { check, validationResult } = require('express-validator');

// Middleware validation cho đăng ký
const validateRegister = [
    check('firstname')
        .notEmpty().withMessage('Firstname không được để trống')
        .isLength({ min: 2 }).withMessage('Firstname phải có ít nhất 2 ký tự')
        .matches(/^[\p{L} ]+$/u).withMessage('Firstname chỉ được chứa chữ cái'),

    check('lastname')
        .notEmpty().withMessage('Lastname không được để trống')
        .isLength({ min: 2 }).withMessage('Lastname phải có ít nhất 2 ký tự')
        .matches(/^[\p{L} ]+$/u).withMessage('Lastname chỉ được chứa chữ cái'),

    check('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),

    check('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),

    check('mobile')
        .notEmpty().withMessage('Số điện thoại không được để trống')
        .matches(/^(0[3-9])+([0-9]{8})$/).withMessage('Số điện thoại không hợp lệ'),

    // Middleware kiểm tra lỗi validation
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array().map(err => err.msg) 
            });
        }
        next();
    }

    
];
// Middleware validation cho đăng nhập
const validateLogin = [
    check('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),

    check('password')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                errors: errors.array().map(err => err.msg) 
            });
        }
        next();
    }
];
module.exports = { validateRegister, validateLogin };
