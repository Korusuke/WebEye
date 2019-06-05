const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const secrets = require('../config/secrets');
const mapping=require('../models/mapping');
const stats = require('../models/stats');
const SHA256 = require('crypto-js/sha256');


var user='synerman';
var password=process.env.password || secrets.password;
const mongourl=`mongodb://${user}:${password}@ds261626.mlab.com:61626/webeye-aditya`;
// console.log(mongourl);
mongoose.connect(mongourl, {useNewUrlParser: true});

router.post('/createnew', function(req, res){
  mapping.findOne({'ogurl':req.body.ogurl}) 
    .exec(function(err, result) {
      if(!err && !result)
      {
      // Create token and minified url
        var token = uuidv4();
        console.log(typeof token);
        var temp = String(SHA256(token));
        temp=temp.slice(0,5);
        //   var minurl = `https://web-aye.herokuapp.com/${temp}`;
        var minurl = `http://localhost:7000/urls/${temp}`;
        // Save to 'mapping' colllection
        var map = new mapping({ 
          _id : new mongoose.Types.ObjectId(),
          ogurl : req.body.ogurl,
          murl : minurl,
          token : token,
        });
        map.save()
          .then(function(result){
            console.log(result + 'saved successfully');
          })
          .catch(function(err){
            console.log(err);
          });
        console.log('WTF');
        // Save to 'stats' collection
        var stat = new stats({ 
          _id : new mongoose.Types.ObjectId(),
          count : 0,
          ip : [],
          murl : minurl,
          token : token,
        });
        stat.save()
          .then(function(result){
            console.log(result);
          })
          .catch(function(err){
            console.log(err);
          });
        // Response to user 
        res.json({
          msg:'Here\'s your minified url and access token to edit it later.',
          murl: minurl,
          token: token,
        });
      }
      else{
        console.log('Already exists.');
        res.json({
          msg : 'A minified url already exists for this url',
        });
      }
    });
});

// Mainly for debugging 
router.post('/allobjs', function(req, res) {
  console.log('getting all objects');
  mapping.find()
    .exec(function(err, result) {
      if(err) {
        res.send('error occured');
      } else {
        console.log(result);
        res.json(result);
      }
    });
});
  

router.post('/getStatus', function(req,res){
  res.send(req.body);
});

router.put('/updateURL', function(req,res){
  res.send(req.body);
}); 

module.exports=router;