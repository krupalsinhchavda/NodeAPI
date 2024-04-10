const express = require('express');
const dbConnection = require('../dbconnection');

const app = express();
const port = 3000;

// Define a route to handle GET requests for fetching data by ID
app.get('/country/GetCountryById', (req, res) => {
    const id = req.query.id; // Get the ID from the query parameters
    if (!id) {
        res.status(400).json({ error: 'ID Parameter is required' });
        return;
    }
    dbConnection.query("Select * from country Where id = ?", id, function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: "Internal Server Error" })
            return;
        }
        // If no records found, send 404 status code
        if (result.lenght === 0) {
            res.status(404).json({ error: "Record not found" });
        }
        else {
            // If record found, send 200 status code with the fetched data
            res.status(200).json({ message: ' Get Record successfully', Data: result[0] });
        }
    });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);

})
// http://localhost:3000/country/GetCountryById?id=12
