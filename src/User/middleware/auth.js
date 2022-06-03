const jwt=require('jsonwebtoken')
const UserModel=require('../model/UserEntry')

const auth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decode=jwt.verify(token,process.env.SECRET_CODE)
        const user=await UserModel.findById({_id:decode._id,'tokens.token':token})
        if(!user){
            throw new Error("Please Authenticate")
        }
        req.user=user
        req.token=token
        next()
    }catch(e){
        res.status(500).send({"error":e})
    }
    
}
module.exports=auth