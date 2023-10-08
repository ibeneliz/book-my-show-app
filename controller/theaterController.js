const theaterRoutes = require('express').Router();
const bodyParser = require('body-parser');
const redisClient = require("../middleware/redis-cache.js");
const pool = require("../connection/dbConnection.js");
const mysql = require('mysql');
theaterRoutes.use(bodyParser.json());

theaterRoutes.get('/:city', async(req,res) => {
    const city = req.params.city;
    // Check if the data is cached in Redis
    const cachedData = await redisClient.Client.get(`city:${city}`);
    if (cachedData) {
        // Return the cached data
        return res.status(200).json(JSON.parse(cachedData));
    }
    // Get the data from the database
    let selectQuery = 'select theatre_name, city from theatre where city = ?';
    let query = mysql.format(selectQuery, [city]);
    pool.query(query, async(err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({"message" : "Error occured!"});
        }
        console.log('Result: \n', rows);
        if(rows.length == 0){
            return res.status(400).json({"message" : "No theaters available in the selected city."});
        }
        // Cache the data in Redis
        await redisClient.Client.set(`city:${city}`, JSON.stringify(rows), { EX: 10 });
        return res.status(200).json(rows);
    });
});

theaterRoutes.get('/:theater_id/movies/:date', async(req,res) => {
    try{
        const theatreId = req.params.theater_id;
        const date = req.params.date;
        // Check if the data is cached in Redis
        const cachedData = await redisClient.Client.get(`movies:${theatreId}:${date}`);
        if (cachedData) {
            // Return the cached data
            return res.status(200).json(JSON.parse(cachedData));
        }
        // Get the data from the database
        let selectQuery = 'select shows.timing, theatre.theatre_name, shows.movie_format, shows.movie_date, shows.movie_language, movie.movie_name from movie left join shows on shows.show_id = movie.show_id left join theatre on movie.theatre_id = theatre.theatre_id where shows.movie_date = ? and theatre.theatre_id = ?';
        let query = mysql.format(selectQuery, [date, theatreId]);
        pool.query(query, async(err, rows) => {
            if (err) {
                console.log(err);
                return res.status(500).json({"message" : "Error occured!"});
            }
            if(rows.length == 0){
                return res.status(400).json({"message" : "No shows available in the selected theatre for the selected date."});
            }
            // Cache the data in Redis
            await redisClient.Client.set(`movies:${theatreId}:${date}`, JSON.stringify(rows), { EX: 10 });
            return res.status(200).json(rows);
        });
    }catch(error){
        console.log(error);
    }   
});

theaterRoutes.post('/:theater_id/shows/:show_id', async(req,res) => {
    const seatBooked = [];
    const seatBookingFailed = [];
    let userId = "";
    const bookStatus = 'Available';
    const theatreId = req.params.theater_id;
    const showId = req.params.show_id;
    const bookingData = req.body.booking;
    for(let i=0; i < bookingData.length; i++){
    const seatRow = bookingData[i].seatRow;
    const seatNumber = bookingData[i].seatNumber;
    // Get userId
    let selectQuery = 'SELECT user_id FROM users WHERE user_name = ? AND emailId = ?';
    let query = mysql.format(selectQuery, [req.body.username, req.body.emailId]);
    pool.query(query, async(err, userId) => {
        if (err) {
            return res.status(500).json({"message" : "Error occured!"});
        }
        if(userId.length == 0){
            return res.status(401).json({"message" : "User not found"});
        }
        // Lock the seat
        let selectQuery = 'SELECT seat_id FROM seats WHERE show_id = ? AND seat_row = ? AND seat_number = ? AND theatre_id = ? AND booking_status = ? FOR update';
        let query = mysql.format(selectQuery, [showId, seatRow, seatNumber, theatreId, bookStatus]);
        pool.query(query, async(err, result) => {
            if (err) {
                return res.status(500).json({"message" : "Error occured!"});
            }
            if(result.length == 0){
                return res.status(401).json({"message" : "Seat not available."});
            }
            try{
                if (result.length > 0) {
                    pool.query(`
                    UPDATE seats
                    SET user_id = ?,
                    booking_status = "Booked"
                    WHERE seat_id = ?
                    `, [1, result[0].seat_id]);
                    //pool.commit();
                    let seat = seatRow+ seatNumber;
                    seatBooked.push(seat);
                    return res.status(200).json({"message" : "Seat booked successfully."});
                } else {
                    // Seat is not available
                    await pool.rollback();
                    let seat = seatRow+ seatNumber;
                    seatBookingFailed.push(seat);
                }
            }catch(error){
                console.log(error);
                return res.status(500).json({"message" : "Error occured in booking seat!"});
            }
        });
    });
    }
});

module.exports = theaterRoutes;