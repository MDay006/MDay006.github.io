require('dotenv').config();   // load environment variables from .env

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const routesApi = require('./app_api/routes/index');

const app = express();

app.listen(3001, () => console.log('Server running on port 3001'));  
// port 3000 was in use, and I couldnt figure out how to stop it, I even looked it up and it didnt work. 
// so I changed it to 3001.
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (err) => {
  console.error(' MongoDB connection error:', err);
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // allow frontend to connect
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', routesApi);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
  
});

module.exports = app;
