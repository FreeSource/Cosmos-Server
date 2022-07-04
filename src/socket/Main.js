const routes = require('./Routes');
const socket = require('socket.io');

const registerSocketServer = (server) => {

    /* Create main socket server. */
    const io = socket(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        },
    });

    /* Websocket started. */
    console.log("🪐 - Cosmos websocket started.");

    /* Get routes for socket. */
    io.on('connection', (socket) => {
        routes.map((route) => {
            socket.on(route.name, (data) => route.controller(socket, data));
        });

        return io;
    });
};

module.exports = {
  registerSocketServer,
};