const app = require('./app');
const socket = require('./socket/Main');
const config = require('./config/config');

/* Fetch needed cron jobs. */
require('./cronJobs');

/* Create an http server from app.js module export. */
const http = require('http');

/* Start REST API server. */
const server = http.createServer(app);

/* Start websocket server */ 
socket.registerSocketServer(server);

/* Start the Cosmos API on the specified port. */
server.listen(config.port, () => {
    console.log(`🌌 - Cosmos server started on port: ${config.port}`);
});
