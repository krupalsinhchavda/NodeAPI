const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dk" // Add your database name here
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
});

module.exports = con; // Export the connection object
