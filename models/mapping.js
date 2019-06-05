var mongoose=require('mongoose');

var mappingSchema=mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  ogurl:{
    type: String,
  },
  murl:{
    type: String,
  },
  token:{
    type: String,
  }
});

module.exports=mongoose.model('mapping',mappingSchema);