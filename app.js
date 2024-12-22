var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

var app = express();

app.use(session({
  secret: 'D45HY72F5F5',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const scheduleRoutes = require('./routes/scheduleRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const trainingRoutes = require('./routes/trainingRoutes');
const userRoutes = require('./routes/userRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const programRoutes = require('./routes/programRoutes');
const membershipRoutes = require('./routes/membershipRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public', { maxAge: 0 }));

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!(req.session && req.session.user); // Перевірка аутентифікації
  res.locals.isAdmin = req.session?.user?.role === 'admin'; // Перевірка ролі адміністратора
  next();
});

app.use('/', indexRouter);
app.use('/dashboard', authMiddleware, dashboardRouter);
app.use('/adminpanel', authMiddleware, adminMiddleware, adminRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/trainings', trainingRoutes);
app.use('/users', userRoutes);
app.use('/trainers', trainerRoutes);
app.use('/programs', programRoutes);
app.use('/memberships', membershipRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;





