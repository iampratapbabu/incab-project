const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"A name is required"]
  },
  email:{
    type:String,
    unique:true,
    required:[true,"An email is necessary"]
  },
  password:{
    type:String,
    required:[true,"Please type your password"],
    minlength:8,
    select:false
  },
  passwordConfirm:{
    type:String,
    required:[true,"Please confirm your password"],
    select:false,
    validate:{
      validator:function(el){
        return el === this.password;
      },
      message:"password do not match"
    }
  },
  gender:{
    type:String,
    default:"not inputted"
},
passwordChangedAt:String,
passwordResetToken:String,
passwordResetExpires:Date

});

//hashing the password before saving it to the database
userSchema.pre('save',async function(next){
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password,12);
  this.passwordConfirm = undefined;
  next();
});

//updating the passwordChangedAt in database after updating the password through email
userSchema.pre('save',function(next){
  if(!this.isModified('password') || !this.isNew){
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
})

//universal function can b accessed from anywhere
userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
  return await bcrypt.compare(candidatePassword,userPassword)
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000,10);
    return JWTTimestamp < changedTimeStamp;
  }
  return false;
}

userSchema.methods.createPasswordResetToken = function (){
const resetToken = crypto.randomBytes(32).toString('hex');

this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
this.passwordResetExpires = Date.now() + 30*60*1000;
return resetToken;
}

const User = mongoose.model('User',userSchema);

module.exports = User;
