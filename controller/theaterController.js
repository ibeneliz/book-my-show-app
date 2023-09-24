const theaterRoutes = require('express').Router();
const bodyParser = require('body-parser');
const mysqlClient = require('../connection/connection.js');
const mysql = require('mysql');
theaterRoutes.use(bodyParser.json());

theaterRoutes.get('/:city',(req,res) => {
    const city = req.params.city;
    let selectQuery = 'select theatre_name, city from theatre where city = ?';
    let query = mysql.format(selectQuery, [city]);
    mysqlClient.Client.query(query, (err, rows) => {
        if (err) {
            console.log(err);
            throw err; }
        console.log('Result: \n', rows);
        if(rows.length == 0){
            return res.status(400).json({"message" : "No theaters available in the selected city."});
        }
        return res.status(200).json(rows);
    });
});

theaterRoutes.get('/:theater_id/movies/:date',(req,res) => {
    const theatreId = req.params.theater_id;
    const date = req.params.date;
    let selectQuery = 'select shows.timing, theatre.theatre_name, shows.movie_format, shows.movie_date, shows.movie_language, movie.movie_name from movie left join shows on shows.show_id = movie.show_id left join theatre on movie.theatre_id = theatre.theatre_id where shows.movie_date = ? and theatre.theatre_id = ?';
    let query = mysql.format(selectQuery, [date, theatreId]);
    mysqlClient.Client.query(query, (err, rows) => {
        if (err) throw err;
        console.log('Result: \n', rows);
        if(rows.length == 0){
            return res.status(400).json({"message" : "No shows available in the selected theatre for the selected date."});
        }
        return res.status(200).json(rows);
    });
});

module.exports = theaterRoutes;