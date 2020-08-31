const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  },
  age:{
    type:Number,
    required:true
  },
  gender:{
    type:String,
    required:true
  },
  createdAt:{
		type:Date,
		default:Date.now()
	},
  img:String

});

const User = mongoose.model('User',userSchema);

module.exports = User;
