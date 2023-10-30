const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Handling uncaught exceptions (synchronous errors)
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// const conParams = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// };

// mongoose.connect(DB, conParams).then((con) => {
//   console.log(con.connections);
//   console.log('DB connection successful');
// });

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

// console.log(app.get('env'));

// console.log(process.env);

// Object.entries(process.env).forEach(([key, value]) => {
//   console.log(`${key}=${value}`);
// });

// const port = process.env.PORT || 3000;

const port = 3000;
const server = app.listen();
app.listen(port, () => {
  console.log(`App running in ${process.env.NODE_ENV} on port ${port}...`);
});

//Handling unhandled rejections outside of express (Asynchronous errors)
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

//For heroku
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated');
  });
});
