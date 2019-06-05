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


router.all('/*+', function(req, res) {
  console.log('getting all objects');
  var temp=req.originalUrl;
  const url=`http://localhost:7000${temp}`;
  console.log(url);
  mapping.find({'murl':url}).exec(function(err,result){
    if(!err){
      // res.redirect(301, result.ogurl);
      // res.redirect(result[0].ogurl);
      const red=result[0].ogurl;
      res.status(301).redirect(red);
    }
    else{
      res.json({
        'msg': result,
      });
    }
  });
});

// // used by the client when he opens the shortened url
// router.post('',function(req,res){
//   // ip : ip address of the device that opened the shortened url
//   // url: the shortened url    
//   console.log("Inside redirect.js");
//   const ip=req.ip;
//   const prot=req.protocol;
//   const host=req.get('host');
//   const url=`${prot}://${host}`;
//   console.log(ip,url);
//   redirect_url=getRedirectUrl(req.originalUrl);
//   console.log(redirect_url);
//   // Now that we have the shortened url and the ip address, we can use db to get the original url where the shortened url points
//   // and also log the ip address and increase the counter by 1
//   res.redirect(redirect_url);
// });

module.exports=router;