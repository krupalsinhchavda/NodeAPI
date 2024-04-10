const dbConnection = require('./dbconnection');

// Function to insert data into the table
function insertData(callback) {
    dbConnection.query("INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')", function (err, result, fields) {
        if (err) {
            callback(err, null); // Pass error to callback
        } else {
            callback(null, 'Data inserted successfully.'); // Pass success message to callback
        }

        // Close the connection
        dbConnection.end(function (err) {
            if (err) throw err;
            console.log("Connection closed!");
        });
    });
}

// Call the function to insert data
insertData(function (err, message) {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log(message);
    }
});

// const dbConnection = require('./dbconnection');

// // Function to insert data into the table
// function insertData(callback) {
//     dbConnection.query("INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')", function (err, result, fields) {
//         if (err) {
//             callback(err, null); // Pass error to callback
//         } else {
//             // Pass the number of affected rows to the callback
//             callback(null, { message: 'Data inserted successfully.', affectedRows: result.affectedRows }); 
//         }

//         // Close the connection
//         dbConnection.end(function (err) {
//             if (err) throw err;
//             console.log("Connection closed!");
//         });
//     });
// }

// // Call the function to insert data
// insertData(function (err, result) {
//     if (err) {
//         console.error("Error:", err);
//     } else {
//         console.log(result.message);
//         console.log("Rows affected:", result.affectedRows);
//     }
// });
