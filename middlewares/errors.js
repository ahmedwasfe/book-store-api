const { model } = require("mongoose");

const notFound = (request, res, next) => {
    const error = new Error(`Not Found - ${request.originalUrl}`)
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
};

module.exports = {
    notFound,
    errorHandler
};