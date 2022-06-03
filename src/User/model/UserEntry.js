const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const bcryptjs=require('bcryptjs')
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter valid email")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("Password should not contain 'Password'")
            }
        }
    },
    userAvatar:{
        type:Buffer
    },
    tokens:[{
        token:{
            type:String,
            trim:true
        }
    }],
    friends:[{
        friend:{
            type:mongoose.Schema.Types.ObjectId
        }
    }]
})
UserSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcryptjs.hash(this.password,8)
    }
    next()
})
UserSchema.statics.findByCredantial=async (email,password)=>{
    const user=await UserModel.findOne({email})
    if(!user){
        throw new Error("Please enter valid email and password")
    }
    const isMatch=await bcryptjs.compare(password,user.password)
    if(!isMatch){
        throw new Error("Please enter valid email and password")
    }
    return user
}
UserSchema.methods.generateAuthToken=async function(){
    const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_CODE,{expiresIn:"7 days"})
    this.tokens=this.tokens.concat({token});
    await this.save()
    if(!this){
        throw new Error("There is error while logging, try again later")
    }
    return token

}
UserSchema.methods.toJSON=function(){
    const UserObj=this.toObject()
    delete UserObj.tokens
    delete UserObj.password
    return UserObj
}


const UserModel=mongoose.model('User',UserSchema)
module.exports=UserModel

