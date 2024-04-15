const express = require('express');
const dbConnection = require('../../dbconnection');

const app = express();
const port = 3000;

// Define a route to handle DELETE requests for deleting data by ID
app.get('/country/DeleteCountryById', (req, res) => {
    const id = req.query.id;// Get the ID from the query parameters

    if (!id) {
        res.status(400).json({ error: 'ID parameter is required' });
        return;
    }
    dbConnection.query("DELETE FROM country WHERE id = ?", id, function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Rocord not found' });
        }
        else {
            // If record deleted successfully, send 204 status code with success message
            // res.status(200).send();
            res.status(200).json({ message: 'Record successfully deleted' });

        }
    });
});
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});