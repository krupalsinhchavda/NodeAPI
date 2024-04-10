const express = require('express');
const dbConnection = require('../dbconnection');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to handle PUT requests for updating data
app.put('/country/UpdateCountryById', (req, res) => {
    const id = req.query.id; // Get the ID from the query parameters
    const { countryname, countrycode } = req.body; // Extract data from the request body

    // Check if all required fields are provided
    if (!id || !countryname || !countrycode) {
        res.status(400).json({ error: 'ID, countryname, and countrycode are required fields' });
        return;
    }

    const modifiedOn = new Date(); // Get the current date and time

    // Perform the update in the database
    dbConnection.query("UPDATE country SET countryname = ?, countrycode = ?, modifiedOn = ? WHERE id = ?", [countryname, countrycode, modifiedOn, id], function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            // If update is successful, send 200 status code with success message
            res.status(200).json({ message: 'Record successfully updated' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
