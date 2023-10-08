const mysql = require('mysql');

class MysqlClient {
    constructor() {
        this.Client = null;
    }
     
    async connect() {
      if (!this.Client) {
        this.Client  = await mysql.createConnection({
            host: process.env.SERVER_HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });
      }
  
      try {
        await this.Client.connect();
        console.log('Connected to Mysql:');
      } catch (error) {
        console.log('Error connecting to Mysql:', error);
      }
      return this.Client;
    }
  }

module.exports = new MysqlClient();