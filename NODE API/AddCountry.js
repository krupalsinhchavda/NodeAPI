const express = require('express');
const dbConnection = require('../dbconnection');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/country/AddCountry', (req, res) => {
    const { countryname, countrycode } = req.body;

    if (!countryname || !countrycode) {
        res.status(400).json({ error: "All Filed are required" });
        return;
    }
    const createdOn = new Date();
    const IsActive = 1;

    dbConnection.query("INSERT INTO country (countryname, countrycode, createdOn, IsActive) VALUES (?, ?, ?, ?)", [countryname, countrycode, createdOn, IsActive], function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        else {
            res.status(201).json({ message: 'Record successfully inserted', Data: result.insertId });
        }
    });
})
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});