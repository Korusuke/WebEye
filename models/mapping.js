var mongoose=require('mongoose');

var mappingSchema=mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  ogurl:{
    type: String,
  },
  murl:{
    type: String,
  },
  visits:{
    type: Number, 
    default: 0,
  },
  ip:{
    type: [String],
  },
  token:{
    type: String,
  }
});

module.exports=mongoose.model('mapping',mappingSchema);