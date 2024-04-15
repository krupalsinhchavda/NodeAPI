const express = require('express');
const router = express.Router();
const dbConnection = require('../dbconnection');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// ADD CITY
router.post('/addCity', (req, res) => {
    const { cityname, countryId, population } = req.body;
    const createdOn = new Date();

    if (!cityname || !countryId || !population) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    dbConnection.query('INSERT INTO city (cityname,countryId,population,createdOn) VALUES (?,?,?,?)', [cityname, countryId, population, createdOn], function (err, result) {
        if (err) {
            console.error("Error", err);
            res.status(500).json({ error: 'Internal server error' });
        }
        else {
            res.status(201).json({ meassage: 'Record Successfully Inserted', Data: result.insertId });
        }
    });
});

// GET ALL CITY
router.get('/getallcity', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderBy = req.query.orderBy || 'createdOn';
    const orderDirection = req.query.orderDirection || 'DESC';

    const offset = (page - 1) * limit;

    const subquery = `select city.cityname, city.countryId, city.population,city.createdOn , country.countryname from city join country on city.countryId = country.id order by ${orderBy}      ${orderDirection} limit ${limit} offset ${offset}`;
    dbConnection.query(subquery, function (err, result) {
        if (err) {
            console.error("error", err);
            res.status(500).json({ error: 'Internal server Error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Record not found' })
            return;
        }
        else {
            res.status(200).json({ meassage: "Record Fetch Successfully", Data: result })
        }
    });
});

// GET CITY BY ID
router.get('/cityBYId', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }
    dbConnection.query("select * from city Where id = ?", id, function (err, result) {
        if (err) {
            console.error("error", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Record not found' });
        }
        else {
            res.status(200).json({ meassage: 'Get record successfully', Data: result[0] })
        }
    });
});

// GET CITY BY COUNTRY ID
router.get('/GetCityByCountryId', (req, res) => {
    const countryid = req.query.countryid;
    if (!countryid) {
        console.error("error", err);
        return res.status(400).json({ error: 'Country Id is Required' });
    }
    dbConnection.query('select city.cityname, city.countryId, city.population,city.createdOn , country.countryname from city join country on city.countryId = country.id Where country.id = ?', countryid, (err, result) => {
        if (err) {
            console.error("error", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Record not found' });
        }
        else {
            res.status(200).json({ message: 'Get record successfully', Data: result })
        }
    })
})

// UPDATE CITY
router.put('/Updatecity', (req, res) => {
    const id = req.query.id;
    const modifiedOn = new Date();
    const { cityname, countryId, population } = req.body;
    if (!id || !cityname || !countryId || !population) {
        res.status(400).json({ error: 'All fileds are required' })
    }
    dbConnection.query('UPDATE city SET cityname = ?, countryId = ?, population = ?, modifyOn = ? WHERE id = ?', [cityname, countryId, population, modifiedOn, id], (err, result) => {
        if (err) {
            console.error("error", err);
            return res.status(500).json({ error: 'Internal server error' })
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Rocord not found' })
        }
        else {
            res.status(200).json({ meassage: 'Record update successfully' })
        }
    });
});

// DELETE CITY
router.delete('/DeleteCity', (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    dbConnection.query('DELETE FROM city WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error("error", err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Record not found' });
        }
        else {
            res.status(200).json({ meassage: 'Record Deleted Successfully' });
        }
    });
});
module.exports = router;
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}`);
// });