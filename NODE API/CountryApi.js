const express = require('express');
const dbConnection = require('../dbconnection');
const cors = require('cors');

const app = express();
const port = 3000;
const createdOn = new Date();
const IsActive = 1;

//middlewear to parse json 
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Add API
app.post('/country/AddCountry', (req, res) => {
    const { countryname, countrycode } = req.body;
    if (!countryname || !countrycode) {
        res.status(400)({ error: 'All Feilds are required' });
        return;
    }

    dbConnection.query("INSERT INTO country (countryname, countrycode, createdOn, IsActive) VALUES (?, ?, ?, ?)", [countryname, countrycode, createdOn, IsActive], function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: "Internal servere error" })
        }
        else {
            res.status(201).json({ message: 'Record successfully inserted', Data: result.insertId });
        }
    });
});

// Update API
app.put('/country/UpdateCountryById', (req, res) => {
    const id = req.query.id;
    const { countryname, countrycode } = req.body;

    if (!id || !countryname || !countrycode) {
        res.status(400).json({ error: 'All Fields are required' });
        return;
    }

    const modifiedOn = new Date();
    dbConnection.query("UPDATE country SET countryname = ?, countrycode = ?, modifiedOn = ? where id = ?", [countryname, countrycode, modifiedOn, id], function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'NO record found' });
        } else {
            res.status(200).json({ message: "Record Updated Successfully" })
        }
    })
})

// Delete API
app.delete('/country/DeleteCountryById', (req, res) => {
    const id = req.query.id;

    if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
    }
    dbConnection.query('DELETE FROM country WHERE id = ?', id, function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Rocord not found' });
        }
        else {
            res.status(200).json({ message: 'Record successfully deleted' });
        }
    })
})

// Get by ID API
app.get('/country/GetCountryById', (req, res) => {
    const id = req.query.id;

    if (!id) {
        res.status(400).json({ error: 'Id is required' });
        return;
    }
    dbConnection.query('SELECT * FROM country WHERE id = ?', id, function (err, result) {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Rocord not found' });
        }
        else {
            res.status(200).json({ message: ' Get Record successfully', Data: result[0] })
        }
    })
})
// Get all records API
app.get('/country/GetAllCountry', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.orderBy || 'createdOn';
    const orderDirection = req.query.orderDirection || 'DESC';

    const offset = (page - 1) * limit;

    const sqlquery = `select * from country order by ${orderBy} ${orderDirection} limit ${limit} offset ${offset}`;
    dbConnection.query(sqlquery, function (err, result) {
        if (err) {
            console.error("Error", err);
            res.status(500).json({ error: 'internal server error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'records not found' })
        }
        else {
            res.status(200).json({ message: 'Get Record successfully', Data: result });
        }
    })
})
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});