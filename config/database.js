const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "mysecretpassword", // change with your password 
    database: "school_management",
    connectionLimit: 10,
    connectTimeout: 60000,
    waitForConnections: true,
  })
  .promise();

pool
  .getConnection()
  .then((connection) => {
    console.log("Connected to MySQL database");
    connection.release();
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });
module.exports = pool;
