const express = require('express');
const { mongoose, connect } = require('mongoose');
const cors = require('cors');
require('dotenv').config();



const app = express();





async function startServer() {
    try {

        await mongoose.connect(process.env.MONGO_URI, console.log("MongoDB is connected"));

        app.listen(5000, () => console.log(`Server is live on port ${process.env.PORT}`));

    } catch (error) {
        console.error("The server not able to connnect with the MongoDB", error)

    }
}

startServer();