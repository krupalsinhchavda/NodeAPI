const express = require('express');
const dbConnection = require('../../dbconnection');

const app = express();
const port = 3000;

app.get('/GetAllCountry', (req, res) => {
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