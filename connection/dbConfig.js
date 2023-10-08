require("dotenv").config();
module.exports = {
    host: process.env.SERVER_HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    // queueLimit: 0,
  };