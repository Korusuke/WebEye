const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const secrets = require('../config/secrets');
const mapping=require('../models/mapping');
const SHA256 = require('crypto-js/sha256');


var user='synerman';
var password=process.env.password || secrets.password;
const mongourl=`mongodb://${user}:${password}@ds261626.mlab.com:61626/webeye-aditya`;
mongoose.connect(mongourl, {useNewUrlParser: true});

router.post('/createnew', function(req, res){
  // Required parameters in request body
  // URL to generate a shortened rl for : ogurl
  mapping.findOne({'ogurl':req.body.ogurl}) 
    .exec(function(err, result) {
      if(!err && !result)
      {
      // Create token and minified url
        var token = uuidv4();
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
        // Response to user 
        res.json({
          msg:'Here\'s your minified url and access token to edit it later.',
          murl: minurl,
          token: token,
        });
      }
      else{
        res.json({
          msg : 'A minified url already exists for this url',
        });
      }
    });
});

// Mainly for debugging 
router.post('/allobjs', function(req, res) {
  mapping.find()
    .exec(function(err, result) {
      if(err) {
        res.send('error occured');
      } else {
        res.json(result);
      }
    });
});
  

router.post('/getStatus', function(req,res){
  res.send(req.body);
});

router.put('/updateURL', function(req,res){
  // Required parameters in request body : 
  // Proper access token : accessToken
  // Shortened url to be updated : editUrl
  // The url it is to be updated to : newUrl
  const accessToken = req.body.accessToken;
  var editUrl = req.body.murl;
  var newUrl = req.body.newUrl;
  console.log(editUrl, newUrl);
  // mapping.findOneAndUpdate
  ({'murl':editUrl}).exec(function(err,result){
  //   var obj = result;
  //   if(result!==null){
  //     if(result.token == accessToken){
  //       // Resource exists and user has permission to delete it.
  //       console.log("Allowed to delete this resource");
  //       mapping.remove(obj, function(err, result){
  //         if(!err){
  //           res.json({
  //             'msg': 'Removed resource succcessfully',
  //           });
  //         }
  //       });
  //       }
  //     else{
  //       console.log('Not allowed to edit resource.');
  //     }
  //   }
  //   else{
  //     res.json({
  //     'msg': 'Url does not exist in db',
  //   });
  //     console.log('Url does not exist in db');
  //   }
  //   });
}); 

router.delete('/deleteurl', function(req,res){
  const accessToken = req.body.accessToken;
  const delUrl = req.body.murl;
  mapping.findOne({'murl':delUrl}).exec(function(err,result){
    var obj = result;
    if(result!==null){
      if(result.token == accessToken){
        // Resource exists and user has permission to delete it.
        mapping.remove(obj, function(err, result){
          if(!err){
            res.json({
              'msg': 'Removed resource succcessfully',
            });
          }
        });
        }
      else{
        console.log('Not allowed to delete resource.');
      }
    }
    else{
      res.json({
      'msg': 'Url does not exist in db',
    });
      console.log('Url does not exist in db');
    }
    });
});

module.exports=router;