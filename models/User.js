const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        minLength: 5,
        maxLength: 100,
        unique: true,
    },
    username: {
        type: String,
        require: true,
        trim: true,
        minLength: 3,
        maxLength: 200,
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minLength: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timeseries: true });

// Generate Token
userSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET_KEY);
}

const User = mongoose.model("User", userSchema);

// Validate Register New User
function validateRegisterUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        username: Joi.string().trim().min(3).max(200).required(),
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
}

// Validate Login
function validateLoginUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
};

// Validate Update User
function validateUpdateUser(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).email(),
        username: Joi.string().trim().min(3).max(200),
        password: Joi.string().trim().min(6),
    });
    return schema.validate(obj);
};

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
};
