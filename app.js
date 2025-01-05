const express = require('express');
const logger = require('./middlewares/logger');
const {notFound, errorHandler} = require('./middlewares/errors');
const dotenv = require('dotenv').config();
const connectToDatabase = require('./config/db');

// Connection To Database
connectToDatabase();
// Init App
const app = express();
// Apple Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/books', require('./routes/books'));
app.use('/api/authers', require('./routes/authers'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'))

// ERROR Not Found
app.use(notFound);
// Error Handler Meddleware
app.use(errorHandler);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log('Server is Running ' + 'in mode ' + process.env.NODE_ENV + "....");
});