const User = require('../models/user-model');
const asyncWrapper = require('../middleware/asyncWrapper');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getAllUsers = asyncWrapper(async (req,res) => {
        //pagination
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page -1) * limit;
        
        const users = await User.find({}, {"__v": 0}).limit(limit).skip(skip);
        res.json({status: httpStatusText.SUCCESS, data: {users}});
});

const getOneUser = asyncWrapper(async (req,res,next) => {
        const user = await User.findById(req.params.userId);
        if(!user){
            const error = appError.create('user not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({status: httpStatusText.SUCCESS, user:{user}});
});

const register = asyncWrapper(async (req,res,next)=>{
        const {firstName, lastName, email, password, role} = req.body;
        const user = await User.findOne({email: email});
        if(user){
            const error = appError.create('user already exist', 400, httpStatusText.FAIL);
            return next(error);
        }

        //password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar: req.file.filename,
        });

        //generate JWT token
        const token = await jwt.sign({email: newUser.email, id: newUser._id, role: newUser.role}, process.env.JWT_SECRET_KEY);
        newUser.token = token;

        await newUser.save();
        res.status(201).json({status: httpStatusText.SUCCESS, user:{newUser}});
});

const login = asyncWrapper(async (req,res,next)=>{
    const {_id, email, password, role} = req.body;

    if(!email && !password){
        const error = appError.create('email and password are required', 400, httpStatusText.FAIL);
        return next(error); 
    }

    const user = await User.findOne({email: email});
    if(!user){
        const error = appError.create('user not found', 400, httpStatusText.FAIL);
        return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);
    if(user && matchedPassword){
        const token = await jwt.sign({email: user.email, id: user._id, role: user.role}, process.env.JWT_SECRET_KEY);
        return res.json({status: httpStatusText.SUCCESS, data: {token}});
    }else{
        const error = appError.create('email or password are wrong', 500, httpStatusText.FAIL);
        return next(error);
    }
});



module.exports = {
    getAllUsers,
    getOneUser,
    register,
    login
}