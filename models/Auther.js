const mongoose = require('mongoose');
const Joi = require('joi');

const autherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    lastName: {
        type: String,
        require: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },

    nationality: {
        type: String,
        require: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },

    image: {
        type: String,
        default: "default-avatar.png"
    },
}, { timestamps: true });

const Auther = mongoose.model('Auther', autherSchema);

function validateCreateAuther(obj) {

    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(100).required(),
        lastName: Joi.string().trim().min(3).max(100).required(),
        nationality: Joi.string().trim().min(3).max(200).required(),
        image: Joi.string(),
    });

    return schema.validate(obj);
}

function validateUpdateAuter(obj) {

    const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(100),
        lastName: Joi.string().trim().min(3).max(100),
        nationality: Joi.string().trim().min(3).max(200),
        image: Joi.string(),
    });

    return schema.validate(obj);
}


module.exports = {
    Auther,
    validateCreateAuther,
    validateUpdateAuter,
};