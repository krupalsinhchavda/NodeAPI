const dbConnection = require('./dbconnection');

function selectWhere(callback) {
    dbConnection.query("select * from country where countryname = 'Canada'", function (err, result, fields) {
    // dbConnection.query("select * from country where countryname LIKE 'U%'", function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
        dbConnection.end(function (err) {
            if (err) throw err;
            console.log("Connection Closed");
        });
    });
}
selectWhere(function (err, data) {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Data fetch by Where", data);
    }
})