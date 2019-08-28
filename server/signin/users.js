const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { apiSecret } = require('../../config/secrets');
const { tokenKey } = require('../../config/secrets');

const dbs = require('./../dbconnection');

router.post('/newUser',async (req,res)=>{
  const db = await dbs.get();
  const webeye = await db.db('webeye');
  const user = webeye.collection('user');
  const email = (typeof req.body.email === 'undefined') ? null : req.body.email;
  const name = (typeof req.body.name === 'undefined') ? null : req.body.name;
  const password = (typeof req.body.password === 'undefined') ? null : req.body.password;
  user.findOne({email})
  .then(async (result)=>{
    console.log(result);
    if(result!=null){
      res.json({
        success: false,
        'msg': 'User already exists',
      });
    }
    else{
      const apiKey = await jwt.sign({email},apiSecret);
      obj = {
        name,
        email,
        apiKey,
      };
      Object.keys(obj).forEach(key => (obj[key] == null) && delete obj[key]);
      let saltRounds = 10;
      bcrypt
      .hash(password, saltRounds)
      .then((hash) => {
        obj.password = hash;
        user.insertOne(obj)
          .then(() => {
            res.json({
              msg: 'New user created',
              apiKey
            });
          })
          .catch((er) => {
            console.error(er);
          });
      })
      .catch((error) => {
        console.log(error);
        res.json({
          msg: 'Unable to create user',
        });
      })
    }
  })
  .catch(err=>console.log(err))
});

router.post('/signin', async (req, res) => {
  // Request body should contain:
  // email: obvio   } String
  // password: duh    }
  const db = await dbs.get();
  const webeye = await db.db('webeye');
  const user = webeye.collection('user');
  const { email } = req.body;
  const { password } = req.body;
  user.findOne({ email })
    .then((result) => {
      if (result) {
        console.log(result);
        const { name } = result.name;
        const { email } = result.email;
        bcrypt.compare(password, result.password, (e, bdata) => {
          if (!e) {
            if (bdata) {
              // Sign with jwt and send token to user
              jwt.sign({name, email}, tokenKey, { expiresIn: '1d' }, (er, token) => {
                if (!er) {
                  res.cookie('token', token);
                  res.json({
                    success: true,
                    msg: 'Authenticated',
                  });
                } else {
                  console.log(er);
                }
              });
            } else {
              res.json({
                success: false,
                msg: 'Authentication failed',
              });
            }
          } else {
            console.log(e);
            res.json({
              msg: 'Password field empty',
            });
          }
        });
      } else {
        res.json({
          msg: 'Email not found',
        });
      }
    })
    .catch((err) => { console.log(err); res.sendStatus(500); });
});


module.exports = router;
