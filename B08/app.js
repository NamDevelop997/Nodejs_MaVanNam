var createError     = require('http-errors');
var express         = require('express');
var path            = require('path');
var logger          = require('morgan');

const flash         = require('express-flash-notification');
const cookieParser  = require('cookie-parser');
const session       = require('express-session');

//Define path
global.__base_app         = __dirname + ('/mapp/');
console.log("link:",__dirname);

global.__path_configs  = __base_app  + 'config/';
global.__path_schemas = __base_app +'schemas/';
// global.__path_schemas = __base_app +'schemas/';



const databaseConfig= require(__path_configs + 'database');
const systemConfig  = require(__path_configs + 'system');
const ItemsModel    = require(__path_schemas+ "items");


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
const { dirname } = require('path');

mongoose.connect(`mongodb+srv://${databaseConfig.USERNAME}:${databaseConfig.PASSWORD}@cluster0.yjegk.mongodb.net/${databaseConfig.DATABASE}?retryWrites=false&w=majority`);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('mongoDB connection success!');
});

// view engine setup
app.set('views', path.join(__base_app, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'backend');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__base_app , 'public')));

//local variable
app.locals.systemConfig = systemConfig;

app.use(`/${systemConfig.prefix_admin}`, require(__base_app +'routes/backend/index'));

app.get('/', async (req, res)=>{
  let countItems = 0 ;
  await ItemsModel.count({}).then((count) => { //get count Items
  countItems = count;
});

res.render('pages/backend/dashboard/index', { pageTitle: 'Dashboard' , countItems });
});

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
  res.render('pages/error', { pageTitle: "Error"});
});

module.exports = app;
