
// Importing the Modules
const express = require('express');
const { mongoose, connect } = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const upload = require("express-fileupload");



//imported the routes to work it perfectly

const userRoutes = require('./routes/userRoutes');
const postRoutes = require("./routes/postRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");



// Execute the App
const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));


// routers path
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use(notFound);
app.use(errorHandler);


// Message on the screen to show that server is wokring
app.get('/', (req, res) => {
    res.send(`The server is live on ${process.env.PORT}`)
});










// Connecting the server with the MongoDB and make it live on port 
async function startServer() {
    try {

        await mongoose.connect(process.env.MONGO_URI);

        app.listen(5000, () => console.log(`Server is live on port ${process.env.PORT}`));

    } catch (error) {
        console.error("The server not able to connnect with the MongoDB", error)

    }
}

startServer();