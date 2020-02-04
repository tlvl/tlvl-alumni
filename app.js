const https = require('https');
//const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
//const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
//const credentials = {key: privateKey, cert: certificate};
const helmet = require('helmet');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('./db');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/passport');

const apiRouter = require('./app_api/routes');
const siteRouter = require('./app_server/routes/index');

const app = express();
const hbs = require('hbs');

hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));
// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'thequickbrownfoxjumpsoverthelazydog',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);
app.use('/', siteRouter);

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
  res.render('error');
});

//let httpsServer = https.createServer(credentials, app);
//httpsServer.listen(8443);

module.exports = app;
