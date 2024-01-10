require('dotenv').config();
const mongoose = require('mongoose');
const createError = require('http-errors');
const authRoute = require('./routes/auth');
const cors = require('cors');
require('./socket-handler');


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRoute);

//errors

app.use((err, req, res, next) => {
    if (req.get('accept').includes('json')) {
        return next(createError(404))
    }
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.use((err, req, res, next) => {
    if (err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'Casterror') {
        err.status = 422;
    }
    res.status(err.status || 500).json({ message: err.message || 'some error eccured.' });
});



const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);

    } catch (error) {
        console.log(error);
    }
};

start();


module.exports = app;
