var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();


var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://namdevelop997:ANHnam997@cluster0.yjegk.mongodb.net/nodejs?retryWrites=false&w=majority');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoDB connection success!');
});


const systemConfig = require('./config/system');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'backend');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//local variable
app.locals.systemConfig = systemConfig;



app.use(`/${systemConfig.prefix_admin}`, require('./routes/backend/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('./pages/error', { pageTitle: "Error"});
});

module.exports = app;
