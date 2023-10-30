const path = require('path');
// const pug = require('pug');

const express = require('express'); //import express
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitise = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes'); // importing tourRouter function
const userRouter = require('./routes/userRoutes'); //importing userRouter function
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

//Start express app
const app = express();

//tell express what template engine to use
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// app.set("views", "./views")

// 1) Global MIDDLEWARES

//Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

// app.use(
//   express.static(path.join(__dirname, 'public'), {
//     setHeaders: (res, path, stat) => {
//       if (path.endsWith('.js')) {
//         res.set('Content-Type', 'application/javascript');
//       }
//     },
//   }),
// );

//Set security HTTP headers

// app.use(helmet())
app.use(
  helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }),
);

// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use(morgan('dev'));

//Limit request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //60 mins * 60 secs * 1000 seconds = 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//Body Parser; readind data from the body into req.body
app.use(express.json({ limit: '10kb' }));

//Update user data through form
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//Cookie parser: parses the data from the cookie
app.use(cookieParser());

//Data sanitizatioN against NoSQL query injection
app.use(mongoSanitise());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//We used this to demonstrate the concept of middleware
// app.use((req, res, next) => {
//   console.log('Hello from the middleware👋🏼');
//   next();
// });

app.use(compression());

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// // Manually set MIME type for JavaScript files
// app.use(
//   express.static(path.join(__dirname, 'public'), {
//     setHeaders: (res, path, stat) => {
//       if (path.endsWith('.js')) {
//         res.set('Content-Type', 'application/javascript');
//       }
//     },
//   }),
// );

// // Define your routes here
// app.use('/', viewRouter);
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);

//3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Error handling all unhandled routes
// app.all('*', (req, res, next) => {
//   next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
// });

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  const err = new Error(`Cant find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

// section 9(5)
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// app.use(globalErrorHandler);

module.exports = app;
