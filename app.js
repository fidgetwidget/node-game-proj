var express         = require('express');
var path            = require('path');
var favicon         = require('static-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var lessMiddleware  = require('less-middleware');

var mongoose        = require('mongoose');
var db = mongoose.connection;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use( lessMiddleware( path.join(__dirname, 'public') ) );

app.use( express.static( path.join(__dirname, 'public') ) );

/// routes
var index = require('./routes/index');
var api = require('./routes/api');

app.use('/', index);
app.use('/api', api)

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('pages/error', {
    message: err.message,
    error: {}
  });
});

db.on('error', console.error);
db.once('open', function() {});

var mongoUriString = 
    process.env.MONGOHQ_URL || 'mongodb://127.0.0.1:27017/node-game-proj'

mongoose.connect(mongoUriString, function(err, res) {
  if (err) {
    console.log('ERROR: connecting to: ' + mongoUriString + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + mongoUriString);
  }
});

module.exports = app;
