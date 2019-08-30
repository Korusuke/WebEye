const express = require('express');
var app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Use heroku env variable or port 7000
const port = process.env.PORT || 7000;
app.listen(port,function(){console.log('Hey, listening on port %s', port);});

app.set('trust proxy',true);

// body parser middleware
app.use(express.json());
// url encoding
app.use(express.urlencoded({extended:false}));
    
// Routes
app.use('/',require('./server/'));