export function adminMiddleware(req,res,next){
    if(req.user.role !== "admin"){
        return res.status(401).json({
            message:"Admin access Only"
        })
    }
    next();
}