const dbConnection = require('./dbconnection');

// // Example query execution
// dbConnection.query("SELECT * FROM country", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result); // Result contains rows returned by the query

//     // Close the connection after the query has completed (if needed)
//     dbConnection.end(function(err) {
//         if (err) throw err;
//         console.log("Connection closed!");
//     });
// });

function FetchDataFromCountry(callback) {
    dbConnection.query("SELECT * FROM country", function (err, result, fields) {
        if (err) {
            callback(err, null); //pass error to callback
        }
        else {
            callback(null, result); //pass query result to callback
        }
        dbConnection.end(function (err) {
            if (err) throw err;
            console.log("Connection closed!");
        });
    });
}

FetchDataFromCountry(function (err, data) {
    if (err) {
        console.error("Error", err);
    } else {
        console.log("Data Fetch Successfully", data);
    }
})