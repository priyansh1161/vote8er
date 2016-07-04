var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session =  require('express-session');
var mongoose = require('mongoose');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var polls = require('./routes/polls');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.connect('  mongodb://test:test@ds011785.mlab.com:11785/vote8er', function(err){
    console.log('connected');
});
var port =process.env.PORT || 80;
app.listen(port, function() {
    console.log('App listening on port 3000!');
});

// app.use(favicon(path.join(___dirname + '/public/images/icon.ico')));
app.use(function(req,res,next){
  if (req.url === '/favicon.ico'){
    res.end();
  }
  else{
    next();
  }
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret : 'x44'
                ,resave: true
                 ,saveUninitialized: true }));

require('./config/passport')(app); // setting passport and adding its stategies 
app.use('/', routes);
app.use('/users', users);
app.use('/auth',auth);
app.use('/polls',polls);
/// catch 404 and forwarding to error handler
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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


