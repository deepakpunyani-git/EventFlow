const { default: mongoose } = require("mongoose");
require('dotenv').config()

async function connectDB(){
    let uri = process.env.MONGODB_URI;
    await mongoose.connect(uri)
}

module.exports = connectDB;