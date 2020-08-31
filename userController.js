const User = require('./userModel');

exports.getAllUsers = async (req,res) =>{
	try{
		const users = await User.find();

		//send response
	    res.status(200).json({
		status:"success",
		results:users.length,
		list:{
			users
		}
	});
	}catch(err) {
		res.status(404).json({
			status:"fail",
			message:err
		});
	}

}

exports.createUser = async (req,res) =>{
	try{
	const newUser = await User.create(req.body)
	res.status(201).json({
				status:"success",
				data:{
					tour:newUser
				}
    });
}catch(err){
	res.status(400).json({
		status:"fail",
		message:err
	});
}
}
