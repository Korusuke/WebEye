var mongoose=require('mongoose');

var statsSchema=mongoose.Schema({
  murl:{
    murlname:{
      type: String,
    },
    visits:{
      type: Number,
    },
    ipaddresses:{
      type: Array,
    },
    token:{
      type: String,
    }
  }
});

module.exports=mongoose.model('stats',statsSchema);