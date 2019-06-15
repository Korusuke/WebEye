const express = require('express');
const router = express.Router();
const secrets = require('../config/secrets');
const mapping=require('../models/mapping');

// db connection 
const mongoose = require('mongoose');

var user='synerman';
var password=process.env.password || secrets.password;
const mongourl=`mongodb://${user}:${password}@ds261626.mlab.com:61626/webeye-aditya`;
// console.log(mongourl);
mongoose.connect(mongourl, {useNewUrlParser: true});


router.get('/*+', function(req, res) {
  var temp=req.originalUrl;
  const url=`http://localhost:7000${temp}`;
  console.log(url);
  console.log();
  mapping.find({'murl':url}).exec(function(err,result){
    if(!err){
      try{
        const red=result[0].ogurl;
        res.status(307).redirect(red);
        // var ip = req.connection.remoteAddress;
        mapping
          .findOneAndUpdate({'murl':url},{$inc:{visits:1}})
          .exec(function(err,result){
            if(!err){
              console.log(result);  
            }
            else{
              res.json({'msg':'Could not find minified url.'});
            }
          });
      }
      catch(e){
        res.json({
          'msg':'URL does not exist',
        });
      }
    }
    else{
      res.json({
        'msg': err,
        'str': 'Hey mate',
      });
    }
  });
});

module.exports=router;