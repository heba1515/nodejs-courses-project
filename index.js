require('dotenv').config();
const express = require('express');
const cors = require('cors');

const path = require('path');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const httpStatusText = require('./utils/httpStatusText');

const mongoose = require('mongoose');
const url = process.env.MONGO_URL;
mongoose.connect(url).then(() => {
    console.log('mongodb server started')
})

app.use(cors());

app.use(express.json());

const coursesRouter = require('./routes/course-route');
const usersRouter = require('./routes/user-route');
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

//global middleware for not found router
app.all('*', (req, res)=>{
    res.status(404).json({status: httpStatusText.ERROR, message: 'This resource is not found.'});
})

//global error handler
app.use((error, req, res, next)=>{
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message});
})




app.listen(process.env.PORT || 5000, ()=>{
    console.log('listening on port: 5000');
})