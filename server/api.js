const express = require('express');
const router = express.Router();
const { tokenKey } = require('../config/secrets');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const dbs = require('./dbconnection');
const uuidv4 = require('uuid');

function verifyToken(req, res, next){
  const token = req.cookies.token;
  if (token !== undefined) {
    jwt.verify(token, tokenKey, (err) => {
      if (err) {
        res.sendStatus(403);
      }
      else{
        req.token = token;
        next();
      }
    });
  }
  else {
    res.json({
      msg: 'Sign to access resource',
    });
  }
}

async function verifyAPIKey(req,res,next){
  var key = req.headers.authorization;
  if(key!=null){
    key = key.split(' ')[1];
    console.log('Key: ',key);
    const db = await dbs.get();
    const webeye = await db.db('webeye');
    const user = webeye.collection('user');
    var decodedData = jwt.decode(key);
    console.log(decodedData);
    req.email = decodedData.email;
    const email = decodedData.email;
    user.findOne({email})
      .then((result)=>{
        if(key===result.apiKey){
          next();
        }
        else{
          res.json({
            'msg': 'Invalid API key',
            'success': false, 
          });
        }
      })
      .catch(err=>console.log(err));
  }
  else{
    res.json({
      'success': false,
      'msg': 'Api key not found',
    });
  }
}

router.post('/newUrl',verifyToken, verifyAPIKey, async function(req, res){
  // Required parameters in request body
  // originalUrl
  const db = await dbs.get();
  const webeye = await db.db('webeye');
  const mapping = webeye.collection('mapping');
  mapping
    .find({'originalUrl':req.body.originalUrl}).toArray((err,result)=>{
      if(!err && result!=[]){
      // Create the token and minified url
        var temp = String(md5(uuidv4()));
        temp=temp.slice(0,7);
        // var minifiedUrl = `https://syn3rman.herokuapp.com/urls/${temp}` || `http://localhost:7000/urls/${temp}`;
        var minifiedUrl = `http://localhost:7000/urls/${temp}`;
        mapping.insertOne({
          'originalUrl': req.body.originalUrl,
          'minifiedUrl': minifiedUrl,
          'ip': [],
          'visits': 0,
          'email': req.email,
        })
          .then(()=>{
            res.json({
              success: true,
              minifiedUrl,
            });
          })
          .catch((err)=>{console.log(err);});
      }
      else{
        if(result==[]){
          console.log(result);
          res.json({
            'msg': 'URL already exists'
          });
        }
        else{
          res.sendStatus(500);
        }
      }
    }); 
});

// Mainly for debugging 
router.post('/allobjs', async function(req, res) {
  const db = await dbs.get();
  const webeye = await db.db('webeye');
  const mapping = webeye.collection('mapping');
  mapping.find({})
    .toArray((err,result)=>{
      if(err){
        console.log(err);
      }
      else{
        res.json(result);
      }
    });
});
  

router.post('/getStatus', function(req,res){
  res.send(req.body);
});

router.post('/updateUrl',verifyToken, verifyAPIKey,async function(req,res){
  const db = await dbs.get();
  const webeye = await db.db('webeye');
  const mapping = webeye.collection('mapping');
  var minifiedUrl = req.body.minifiedUrl;
  var newUrl = req.body.newUrl;
  if(newUrl==null){
    res.json({
      'success': false,
      'msg': 'Could not find new url',
    });
  }
  else{
    mapping
      .findOne({minifiedUrl})
      .then((result)=>{
      // Could not find url
        if(result!=null){
          console.log(result.email, req.email);
          // Requester is the owner of the resource
          if(result.email===req.email){
            mapping
              .findOneAndUpdate({minifiedUrl}, {$set: {originalUrl: newUrl}} ,function(err){
                if(!err){
                  res.json({
                    'msg': 'Successfully updated resource', 
                  });
                }
                else{
                  res.json({
                    'msg':'Error',
                  });
                }
              });
          }
          else{
            res.json({
              'success': false,
              'msg': 'Unable to modify resource.',
            });
          }
        }
        else{
          res.json({
            'msg': 'Url does not exist.',
          });
        }
      })
      .catch(err=>console.log(err));
  }
});

router.post('/deleteUrl', verifyToken, verifyAPIKey, async function(req,res){
  const db = await dbs.get();
  const webeye = await db.db('webeye');
  const mapping = webeye.collection('mapping');
  const minifiedUrl = req.body.minifiedUrl;
  mapping.findOne({minifiedUrl})
    .then((result)=>{
      if(result.email===req.email){
        mapping.deleteOne({minifiedUrl},(err)=>{
          if(err)
            console.log(err);
          else{
            db.close();
            res.json({
              'success': true,
            });
          }
        });
      }
      else{
        res.json({
          'success': false,
          'msg': 'Unable to modify resource.',
        });
      }
    })
    .catch(err=>console.log(err));
});

module.exports=router;