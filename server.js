const mongoose = require('mongoose');
const app = require('./app');

const dotenv = require('dotenv');
dotenv.config({path:'./config.env'});


const DB = process.env.DATABASE;

mongoose.connect(DB,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology: true
}).then(() =>{
	console.log('DB connected succesfully');
});









port = 3000 || process.env.PORT;
app.listen(port,() =>{
  console.log(`Server is started on Port ${port}`);
});
