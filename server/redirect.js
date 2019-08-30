const express = require('express');
const router = express.Router();

// db connection 
const dbs = require('./dbconnection');

router.get('/*+', async function(req, res) {
  const db = await dbs.get();
  const webeye = await db.db('webeye');
  const mapping = webeye.collection('mapping');
  var temp=req.originalUrl;
  console.log(temp);
  // const url=`https://syn3rman.herokuapp.com${temp}` || `http://localhost:7000${temp}`;
  const minifiedUrl = `http://localhost:7000${temp}`;
  console.log(minifiedUrl);
  mapping.findOne({minifiedUrl})
    .then((result)=>{
      console.log(result);
      try{
        const redirectUrl=result.originalUrl;
        console.log(result);
        console.log(redirectUrl);
        res.status(307).redirect(redirectUrl);
        var ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim();
        console.log(ip);
        mapping
          .findOneAndUpdate({minifiedUrl},{$inc:{visits:1}})
          .catch(err=>console.log(err));
      }
      catch(e){
        res.json({
          'msg':'URL does not exist',
        });
      }
    })
    .catch(err=>console.log(err));
});

module.exports=router;