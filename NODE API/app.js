const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// ROUTER NAVIGATION
const userApiRouter = require('./UserApi');
const authApiRouter = require('./auth');
const countryApiRouter = require('./CountryApi');
const cityApiRouter = require('./CityApi');
const coustomerApiRouter = require('./CustomerApi');
const salesApiRouter = require('./SalesApi');

// Use the routes 
app.use('/user', userApiRouter);
app.use('/auth', authApiRouter);
app.use('/country', countryApiRouter);
app.use('/city', cityApiRouter);
app.use('/customer', coustomerApiRouter);
app.use('/sales', salesApiRouter);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});