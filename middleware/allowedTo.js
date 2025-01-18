const appError = require("../utils/appError");

module.exports = (role)=>{
    return (req, res, next)=>{
        if(req.currentLogin.role != role){
            return next(appError.create('Not Authorized', 401));
        }
        next();
    }
}