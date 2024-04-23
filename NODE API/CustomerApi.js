const express = require('express');
const dbConnection = require('../dbconnection');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

// Add API

router.post('/AddCustomer', (req, res) => {
    const { name, address } = req.body;
    if (!name || !address) {
        res.status(400).json({ error: "All fields are required" });
    }

    dbConnection.query("INSERT INTO customers (name , address ) VALUES (?, ?)", [name, address], (err, result) => {
        if (err) {
            console.error("error", err);
            res.status(500).json({ error: 'Internal server error' })
        }
        else {
            res.status(201).json({
                message: 'Recored Successfully Inserted',
                Data: result.affectedRows
            })
        }
    });
});

// Update Customer
router.put('/UpdateCustomer', (req, res) => {
    const nameid = req.query.name;
    const { name, address } = req.body;

    if (!nameid || !name || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    dbConnection.query("UPDATE customers SET name = ?, address = ? where name = ?", [name, address, nameid], (err, result) => {
        if (err) {
            console.error("error", err);
            return res.status(500).json('Internal server error0');
        }
        if (result.lenght === 0) {
            res.status(404).json({ error: 'No recored found' });
        }
        else {
            res.status(200).json({ message: "Record Updated Successfully" })
        }
    });
});

// Delete Customer
router.delete('/DeleteCustomer', (req, res) => {
    const nameid = req.query.name;
    if (!nameid) {
        res.status(400).json({ error: 'ALL fields are required' })
    }
    dbConnection.query('DELETE FROM customers Where name = ?', nameid, (err, result) => {
        if (err) {
            console.error("error", err);
            return res.status(500).json({ error: "Internal server server" });
        }
        if (result.lenght === 0) {
            res.status(404).json({ error: "Record not found" });
        }
        else {
            res.status(200).json({ message: "Recored Deleted Successfully" })
        }
    });
});

// GET ALL

router.get('/GetCustomer', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.orderBy || 'name';
    const orderDirection = req.query.orderDirection || 'DESC';

    const offset = (page - 1) * limit;

    let query = "SELECT * FROM customers";
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
        query += ` WHERE${whereClauses.join(' AND ')}`;
    }

    // Add ORDER BY and LIMIT clauses
    query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?`;

    queryParams.push(offset, limit);

    dbConnection.query(query, queryParams, (err, result) => {
        if (err) {
            console.error("error", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.lenght === 0) {
            res.status(404).json({ error: 'Recored Not Found' })
        }
        // Execute query to retrieve the total count of records in the table
        dbConnection.query('SELECT COUNT(*) AS total FROM customers', (err, totalCountResult) => {
            if (err) {
                console.error("Error", err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (result.lenght === 0) {
                res.status(404).json({ error: 'Recored Not Found' })
            }

            const total = totalCountResult[0].total;
            const totalPages = Math.ceil(total / limit);

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
module.exports = router;