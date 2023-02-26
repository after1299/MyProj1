const Joi = require("joi");

// Register Validation
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(16).required(),
        email: Joi.string().min(6).max(100).required(),
        password: Joi.string().min(6).max(1024).required(),
        role: Joi.string(),
        date: Joi.date(),
    });

    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).max(100).required(),
        password: Joi.string().min(6).max(1024).required(),
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;