var createError     = require('http-errors');
var express         = require('express');
var path            = require('path');
var logger          = require('morgan');

const flash         = require('express-flash-notification');
const cookieParser  = require('cookie-parser');
const session       = require('express-session');

const databaseConfig = require('./config/database');

var app             = express();

app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  // resave: false,
  // saveUninitialized: true,
  // cookie: { secure: true }
}));

// app.use(validator());
app.use(flash(app,{
  viewName: 'pages/backend/notification',
}));

// app.use(body(),);


var expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${databaseConfig.USERNAME}:${databaseConfig.PASSWORD}@cluster0.yjegk.mongodb.net/${databaseConfig.DATABASE}?retryWrites=false&w=majority`);
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

app.use(logger('dev'));
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
