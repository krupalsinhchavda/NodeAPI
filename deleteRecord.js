const dbConnection = require('./dbconnection');

function DeleteRecord(callback) {
    dbConnection.query("DELETE FROM country WHERE name = 'Country'", function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            // callback(null, result)
            callback(null, result.affectedRows > 0 ? "Data Delete SuccessFully":"No Record Founf")
        }
        dbConnection.end(function (err) {
            if (err) throw err;
            console.log("Connection CLosed");
        });
    });
}
DeleteRecord(function (err, message) {
    if (err) {
        console.error("Error:", err);
    }
    else {
        console.log("Meassage", message);
    }
})