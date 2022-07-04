const cron = require('node-cron');

/* Execute a task every X amount of time. */
cron.schedule('* * * * *', () => {
    //console.log('Execute your service here...');
});
