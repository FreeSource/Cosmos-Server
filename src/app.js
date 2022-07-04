const cors = require('cors');
const express = require('express');
const passport = require('passport');
const httpStatus = require('http-status');
const passportJwt = require('./config/passport');
const { errorConverter, errorHandler } = require('./middlewares/error');

/* Import all the routes from the ./route directory. Entry is ./route/index.js */
const routes = require('./route');

/* Get the current working directory of the application. */
process.env.PWD = process.cwd();

/* Create a new express instance. */
const app = express();

/* Configure Passport. */
app.use(passport.initialize());
passport.use('jwt', passportJwt.jwtStrategy);

/* Configure the express instance. */
app.use(cors());
app.use(express.json());
app.options('*', cors());
app.use(express.urlencoded({ extended: true }));

/* Modify application error handling */
app.use(errorConverter);
app.use(errorHandler);

/* Display a message on root endpoint. */
app.get('/', async (req, res) => {
    res.status(httpStatus.OK).send('The Cosmos API is online.');
});

/* Register the api routes from above. */
app.use('/api', routes);

/* Return 404 error, when an endpoint doesn't exist. */
app.use('*', async (req, res) => {
    res.status(httpStatus.NOT_FOUND).send('Endpoint not found.');
});

/* Import all the modules from the ./module directory. Entry is ./module/index.js */
const db = require('./models');
db.sequelize.sync();

/* Export the entire express instance. */
module.exports = app;
