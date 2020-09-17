const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    required:[true,"A Title is Required for the blog"]
  },
  body:{
    type:String,
    required:[true,"A Body is required for the blog"]
  },
  img:String,
  rating:{
    type:Number,
    default:4.0
  },
  category:{
    type:String,
    required:[true,"a category is required"],
    enum:{
      values:['tech','non-tech','confess'],
      message:"Please choose from tech, non-tech and confess"
    }
  },
  views:{
    type:Number,
    default:100
  },
  createdAt:{
    type:Date,
    default:Date.now()
  }
});

const Blog = new mongoose.model('Blog',blogSchema);

module.exports = Blog;
