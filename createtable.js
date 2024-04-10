const dbConnection = require('./dbconnection');

// Function to create table
function createTable(callback) {
    dbConnection.query('CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))', function (err, result, fields) {
        if (err) {
            callback(err, null); // Pass error to callback
        } else {
            callback(null, 'Table "customers" has been successfully created.'); // Pass success message to callback
        }

        // Close the connection
        dbConnection.end(function (err) {
            if (err) throw err;
            console.log("Connection closed");
        });
    });
}

// Call the function to create table
createTable(function (err, message) {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log(message);
    }
});
