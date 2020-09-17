const User = require('../models/userModel');

exports.getAllUsers = async (req,res) =>{
	try{
		const users = await User.find();

		//send response
	    res.status(200).json({
		status:"success",
		results:users.length,
		data:users
	});
	}catch(err) {
		res.status(404).json({
			status:"fail",
			message:err
		});
	}
}


exports.getUser = async (req,res) =>{
	try{
const user = await User.findById(req.params.id);
if(!user){
	res.status(404).json({
		message:"There is no User with this id"
	})
}
res.status(201).json({
	data:user
})
	}catch(err){
		res.status(403).json({
			message:err
		})
	}
}


exports.updateUser = async (req,res) =>{
	try{
		const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
		if(!user){
			res.status(404).json({
				message:"There is no User with this id"
			})
		}
		res.status(201).json({
			data:user
		})
	}catch(err){
		res.status(403).json({
			message:err
		})
	}
}


exports.deleteUser = async (req,res) =>{
	try{
const user = await User.findByIdAndDelete(req.params.id);
if(!user){
	res.status(404).json({
		message:"There is no User with this id"
	})
}
res.status(203).json({
	message:"successfully deleted"
})

	}catch(err){
		res.status(403).json({
			message:err
		})
	}
}
