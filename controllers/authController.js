const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const crypto = require('crypto');
const sendEmail = require('../utils/email');



exports.signup = async(req,res) =>{
	try{
		const newUser = await User.create({
      name:req.body.name,
      email:req.body.email,
      gender:req.body.gender,
      password:req.body.password,
      passwordConfirm:req.body.passwordConfirm
    });


    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
      expiresIn:process.env.EXPIRES_IN
    });

		res.status(201).json({
			status:"success",
      token,
			data:{
				user:newUser
			}
		});
	}catch(err){
		res.status(404).json({
			status:"fail",
			message:err
		});
	}
};


exports.login = async (req,res,next) =>{
  try{
    const {email,password} = req.body;
    //check if email and passsword exist
  if(!email || !password){
  return  res.status(403).json({
      message:"Please input Email and password"
    });
  }

  const user =await User.findOne({email:email}).select('+password');


  if(!user || !(await user.correctPassword(password,user.password))){
    return res.status(404).json({
      message:"Email or password is incorrect"
    })
  }

const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
  expiresIn:process.env.EXPIRES_IN
});

      res.status(200).json({
        token,
        message:"Success"
      });

      next();


  }catch(err){
    res.status(400).json({
      message:"Login failed"
    })
  }
}

//protecting the routes
exports.protect = async (req,res,next) =>{
	try{
		//getting token
		let token;
		if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
			token = req.headers.authorization.split(' ')[1];
		}
		if(!token){
			return res.status(404).json({
				status:"fail",
				message:"No token foud"
			});
		}

		//verifying token
		const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);


		//getting user
		const currentUser = await User.findById(decoded.id);
		if(!currentUser){
			return res.status(404).json({
				status:"fail",
				message:"No User found"
			});
		}

		//watching if password changed after token was issued
		if(currentUser.changedPasswordAfter(decoded.iat)){
			return res.status(401).json({
				status:"fail",
				message:"passsword changed please login again"
			})
		}

 req.user=currentUser;

		next();


	}catch(err){
		res.status(400).json({
			message:"Fail",
			err:err
		})
	}
}

exports.forgotPassword = async (req,res,next) =>{
//getting user
const user = await User.findOne({email:req.body.email});
if(!user){
	return res.status(404).json({
		status:"fail",
		message:"No user found with this email"
	});
}

//generating reset resetToken
const resetToken = user.createPasswordResetToken();

await user.save({validateBeforeSave:false})

//sending to user's email
const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

const message = `Forgot your password Click here to Reset ${resetUrl}.\n if You dont  then ignore`;


try{
	await sendEmail({
		email:user.email,
		subject:"Your Password reset token",
		message
	});

	res.status(200).json({
		status:"success",
		message:"Reset Token sent to your email"
	})
}catch(err){
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	res.status(400).json({
		status:"fail",
		message:err
	});
}


};


//reset password controller
exports.resetPassword = async (req,res,next) =>{
	try{

		//encrypting our token to match with database stored passwordresetToken
		const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

		//getting user by hashed token
		const user = await User.findOne({
			passwordResetToken:hashedToken,passwordResetExpires:{$gte:Date.now()}
		});

		if(!user){
			return res.status(404).json({
				status:"fail",
				message:"User not found"
			});
		}


		//setting the new password
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		await user.save();


		const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
		expiresIn:process.env.EXPIRES_IN
		});


		res.status(200).json({
		status:"success",
		token,
		message:"password successfully changed"
		});



	}catch(err){
		res.status(400).json({
			status:"fail",
			message:err
		});
	}

}

