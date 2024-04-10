const dbConnection = require('./dbconnection');

function updateRecord(callback) {
    dbConnection.query("UPDATE country SET population = 1000000 WHERE name = 'Example Country'", function (err, result) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result.affectedRows > 0 ? 'Data Updated Successfully' : 'No Data Updated');
        }
        dbConnection.end(function (err) {
            if (err) throw err;
            console.log("Connection Closed");
        });
    });
}

updateRecord(function (err, message) {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("meassage:", message);
    }
})