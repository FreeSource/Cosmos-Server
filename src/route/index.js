const express = require('express');
const authRoute = require('./AuthRoutes');
const postRoute = require('./PostRoutes');

const router = express.Router();

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

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
