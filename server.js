// Import libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Import Scripts for Routes
const users = require('./server/signin/users');

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

// Routes
app.use('/', users);
app.get('/', function(req, res){
  res.send('Hey!');
});

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there

app.listen(port, () => console.log(`WebEye up and running on port ${port} !`));
