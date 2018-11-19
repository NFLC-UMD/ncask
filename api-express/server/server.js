const appName = require('./../package').name;
const express = require('express');
const log4js = require('log4js');

const logger = log4js.getLogger(appName);
logger.level = 8;
const app = express();

app.get('/', function(req, res) {
    res.send('Hello me');
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
    logger.info('APP Express listening on:' + port);
});