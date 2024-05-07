const express = require('express');
const dbConnection = require('../dbconnection');
const cors = require('cors');

const app = express();

const router = express.Router()
const port = 3000;
const createdOn = new Date();
const IsActive = 1;

//middlewear to parse json 
app.use(express.json());
// Enable CORS for all routes
app.use(cors());

// Add API
router.post('/AddCountry', (req, res) => {
    const { countryname, countrycode } = req.body;
    if (!countryname || !countrycode) {
        res.status(400).json({ error: 'All Feilds are required' });
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
router.put('/UpdateCountryById', (req, res) => {
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
router.delete('/DeleteCountryById', (req, res) => {
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
router.get('/GetCountryById', (req, res) => {
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
    });
});

// Get all records API
router.get('/GetAllCountry', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.orderBy || 'createdOn';
    const orderDirection = req.query.orderDirection || 'DESC';

    const offset = (page - 1) * limit;

    let query = "SELECT * FROM country";
    const queryParams = [];

    // where and filter structure
    const filterParams = req.query;
    const whereClauses = [];

    for (const [key, value] of Object.entries(filterParams)) {
        if (key !== 'page' && key !== 'limit' && key !== 'orderBy' && key !== 'orderDirection') {
            whereClauses.push(`${key} LIKE ?`);
            queryParams.push(`%${value}%`);
        }
    }

    // Add WHERE clause to query if there are any filters
    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Add ORDER BY and LIMIT clauses
    query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?`;

    queryParams.push(offset, limit);

    dbConnection.query(query, queryParams, (err, result) => {
        if (err) {
            console.error("Error", err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (result.lenght === 0) {
            res.status(404).json({ error: 'Recored Not Found' })
        }

        // Execute query to retrieve the total count of records in the table
        dbConnection.query("SELECT COUNT(*) AS total FROM country", function (err, totalCountResult) {
            if (err) {
                console.error("Error", err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            
            if (result.lenght === 0) {
                res.status(404).json({ error: 'Recored Not Found' })
            }
            const total = totalCountResult[0].total; // Retrieve the total count from the result
            const totalPages = Math.ceil(total / limit); // Calculate total pages

            res.status(200).json({
                message: 'Get Record successfully',
                data: result,
                page: page,
                limit: limit,
                total: total,
                totalPages: totalPages
            });
        });
    });
});

// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });

module.exports = router;