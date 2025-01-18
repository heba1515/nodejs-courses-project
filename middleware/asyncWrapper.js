module.exports = (asyncFunction)=>{
    return (req, res, next)=>{
        asyncFunction(req,res,next).catch((e)=>{
            next(e);
        });
    }
}