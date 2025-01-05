const mongoose = require('mongoose');

async function connectToDatabase() {
    // mongodb://localhost:27017/collectionName
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected To MongoDB...'))
        .catch((error) => console.log('Connection failed To MongoDB...', error));
}

module.exports = connectToDatabase;