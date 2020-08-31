const express = require('express');
const userRouter = require('./userRoute');
const app = express();

//Route middlewares
app.use('/api/users',userRouter);

module.exports = app;
