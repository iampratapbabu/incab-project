const express = require('express');
const userRouter = require('./routes/userRoute');
const blogRouter = require('./routes/blogRoute');
const app = express();

//important to save data in json format in mongodb
app.use(express.json());


//Route middlewares
app.use('/api/users',userRouter);
app.use('/api/blogs',blogRouter);

module.exports = app;
