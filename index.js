const express = require('express');
const bodyParser = require('body-parser');
const routes = require('express').Router();
const redisClient = require("./middleware/redis-cache.js");
const theaterRoutes = require('./controller/theaterController.js');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(routes);

try {
    redisClient.connect();
    console.log('Connected to redis.');
} catch (error) {
    console.log(error);
}

app.get('/', (req, res) => {
    return res.status(200).send("Welcome to Book My Show API.");
})

app.use('/theaters', theaterRoutes);

app.listen(process.env.PORT, (error) => {
    if (!error) {
        console.log(`Server has started successfully`);
    } else {
        console.log(`Error occured`);
    }
})