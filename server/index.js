'use strict';

const fallback = require(`express-history-api-fallback`);
const path = require('path');
const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const debug = require('debug');
const fileUpload = require('express-fileupload');

const logger = debug('mylogger');
logger('Starting app');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());
app.use(fileUpload());

const root = path.resolve(__dirname, '..', 'public');

app.use(fallback('index.html', {root}));

const port = process.env.PORT || 8081;

app.listen(port, function () {
  logger(`Server listening port ${port}`);
});
