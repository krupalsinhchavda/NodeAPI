const express = require('express');
const dbConnection = require('../dbconnection');

const app = express();
const port = 3000;

// Define a route to handle GET requests for fetching data
app.get('/country/GetAllCountry', (req, res) => {
    dbConnection.query("SELECT * FROM country", function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.length === 0) {
            // If no records found, send 404 status code
            res.status(404).json({ error: 'No records found' });
        } else {
            // If records found, send 200 status code with the fetched data
            res.status(200).json({ message: 'Get Record successfully', Data: result });
        }
    });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});