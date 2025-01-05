const mongoose = require('mongoose');
const Joi = require('joi');
const { Auther } = require('./Auther');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    auther:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: Auther
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 250,
    },
     price: {
        type: Number,
        required: true,
        min: 0
    },
     cover: {
        type: String,
        require: true,
        enum: ["soft cover", "hard cover"]
    }
}, {timeseries: true});

// Book model
const Book = mongoose.model("Book", bookSchema);

function validateCreateBook(obj) {

    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(100).required(),
        auther: Joi.string().trim().required(),
        description: Joi.string().trim().min(5).max(250).required(),
        price: Joi.number().min(0).required(),
        cover: Joi.string().valid("soft cover", "hard cover").required(),
    });

    return schema.validate(obj);
}

function validateUpdateBook(obj) {

    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(100),
        auther: Joi.string().trim(),
        description: Joi.string().trim().min(5).max(250),
        price: Joi.number().min(0),
        cover: Joi.string().valid("soft cover", "hard cover"),
    });

    return schema.validate(obj);
}


module.exports = {
    Book,
    validateCreateBook,
    validateUpdateBook
};