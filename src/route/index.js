const express = require('express');
const authRoute = require('./AuthRoutes');
const postRoute = require('./PostRoutes');

/* Create a new Express router. */
const router = express.Router();

/* Setup the needed routes. */
const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },

    {
        path: '/post',
        route: postRoute,
    },
];

/* Loop through route array and setup routes. */
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
