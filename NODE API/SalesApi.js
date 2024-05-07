const express = require('express');
const dbConnection = require('../dbconnection');
const cors = require('cors');
const upload = require('./multerConfig');

const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());

// Add Salesman
router.post('/AddSalesman', upload.single('ProfileImg'), (req, res) => {
    const { FirstName, LastName, Email, Phone, Address, CityID, State, ZipCode, HireDate, Commission } = req.body;
    const ProfileImg = req.file ? req.file.path : null;
    const createdOn = new Date();

    dbConnection.query('INSERT INTO salesman ( FirstName, LastName, Email, Phone, ProfileImg, Address, CityID, State, ZipCode, HireDate, Commission, createdOn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [FirstName, LastName, Email, Phone, ProfileImg, Address, CityID, State, ZipCode, HireDate, Commission, createdOn], (err, result) => {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: "Internal servere error" })
        }
        else {
            res.status(201).json({ message: 'Record successfully inserted', Data: result.insertId });
        }
    });
});

// Update Salesman
router.put('/UpdateSalesman', upload.single('ProfileImg'), (req, res) => {
    const SalesmanID = req.query.salesmanId;
    const { FirstName, LastName, Email, Phone, Address, CityID, State, ZipCode, HireDate, Commission } = req.body;
    const modifiedOn = new Date();
    let ProfileImg = null;

    if (req.file) {
        ProfileImg = req.file.path;
    } else {
        ProfileImg = req.body.oldProfileImg;
    }

    dbConnection.query('UPDATE salesman SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, ProfileImg = ?, Address = ?, CityID = ?, State = ?, ZipCode = ?, HireDate = ?, Commission = ?, modifiedOn = ? WHERE SalesmanID = ?', [FirstName, LastName, Email, Phone, ProfileImg, Address, CityID, State, ZipCode, HireDate, Commission, modifiedOn, SalesmanID], (err, result) => {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Record not found' });
        }
        else {
            res.status(200).json({
                message: 'Record Successfully Updated',
                Data: result.affectedRows
            });
        }
    });
});

// Get All Salesman
router.get('/GetAllSalesman', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.orderBy || 'CreatedOn';
    const orderDirection = req.query.orderDirection || 'DESC';

    const offset = (page - 1) * limit;

    let query = "SELECT * FROM salesman";
    const queryParams = [];

    const filterParams = req.query;
    const whereClauses = [];

    for (const [key, value] of Object.entries(filterParams)) {
        if (key !== 'page' && key !== 'limit' && key !== 'orderBy' && key !== 'orderDirection') {
            whereClauses.push(`${key} LIKE`);
            queryParams.push(`%${value}%`);
        }
    }

    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` ORDER BY ${orderBy} ${orderDirection} LIMIT ?, ?`;

    queryParams.push(offset, limit);

    dbConnection.query(query, queryParams, (err, result) => {
        if (err) {
            console.error("Error", err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (result.length === 0) {
            res.status(404).json({ error: 'Record not found' });
        }

        dbConnection.query("SELECT COUNT(*) AS total FROM salesman", (err, totalCountResult) => {
            if (err) {
                console.error("Error", err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            if (result.length === 0) {
                res.status(404).json({ error: 'Record not found' });
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

// GET SALESMAN BY ID
router.get('/GetSalesmanById', (req, res) => {
    const salesmanid = req.query.salesmanId;
    if (!salesmanid) {
        return res.status(400).json({ error: 'Salesman Id is required' });
    }

    dbConnection.query("SELECT * FROM salesman WHERE SalesmanID = ?", salesmanid, (err, result) => {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Record not found' });
        }
        else {
            res.status(200).json({ message: ' Get Record successfully', Data: result[0] })
        }
    })
});

//Delete Salesman
router.delete('/DeleteSalesman', (req, res) => {
    const salesmanid = req.query.salesmanId;
    if (!salesmanid) {
        return res.status(400).json({ error: 'Salesman Id is required' });
    }
    dbConnection.query('DELETE FROM salesman WHERE SalesmanID = ?', salesmanid, function (err, result) {
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
    });
});
module.exports = router;