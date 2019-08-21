const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const graphqlRouter = require('./routes/graphqlRouter');

const app = express();

app.use(cors({origin: 'https://fidelityinsightsimple-pavelma.msappproxy.net'}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.options('*', cors({origin: 'https://fidelityinsightsimple-pavelma.msappproxy.net'}));
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/graphql', graphqlRouter);

module.exports = app;
