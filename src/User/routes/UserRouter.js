const express=require('express')
const routes=express.Router()
const UserModel=require('../model/UserEntry')
const auth=require('../middleware/auth')
const { Router } = require('express')
const {ObjectId}=require('mongodb')

routes.post('/user',async (req,res)=>{
    try{
        const user=await new UserModel(req.body)
        await user.save()
        if(user){
            res.status(201).send("created")
        }else{
            throw new Error("There is issue, please try again")
        }
    }catch(e){
        res.status(400).send({e:e})
    }
    
})
routes.post('/user/login',async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
        const user=await UserModel.findByCredantial(email,password)
        const token=await user.generateAuthToken()
        res.status(200).send({"name":user.name,"token":token,"_id":user._id})
    }catch(e){
        res.status(400).send({"error":e})
    }    
})
routes.patch('/user/update/:id',async(req,res)=>{
    const id=req.params.id
    const updateFeilds=Object.keys(req.body)
    const allowedUpdate=['name','password']
    const isValidUpdateFeild=updateFeilds.every((feild)=>{
       return  allowedUpdate.includes(feild)
    })

    if(!isValidUpdateFeild){
        res.status(400).send({"error":"Feilds are not allowed to update"})
    }
    try{
        const user=await UserModel.findById(id)
        if(!user){
            res.status(400).send({"error":"There is no user found"})
        }
        updateFeilds.forEach((feild)=>user[feild]=req.body[feild])
        await user.save()
        if(!user){
            throw new Error("There is error in updating")
        }
        res.status(200).send({"suc":true})

    }catch(e){
        res.status(500).send({"e":e})
    }
})
routes.patch("/user/add/friend/:id",async(req,res)=>{
    const id=req.params.id
    const friend=req.body.friend
    const user=await UserModel.findById(id)
    if(!user){
        res.status(400).send({"error":"There is no user found"})
    }
    try{
        user.friends=user.friends.concat({friend})
        await user.save()
        if(!user){
            res.status(400).send({"suc":false})
        }
        res.status(200).send({"suc":true})
    }catch(e){
        res.status(200).send({"e":e})
    }
})
routes.delete("/user/logout",auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>token.token!==req.token)
        await req.user.save()
        res.status(200).send({"suc":true})

    }catch(e){
        res.status(400).send({"error":e})
    }
})
routes.get('/user/friends',auth,async(req,res)=>{
    // //console.log(req.user)
    // const a=new ObjectId("62924c94180edf872449a398").toString()
    // const b=new ObjectId("62924c94180edf872449a398").toString()
    // console.log(a===b)
    try{
        const friends=[]
        const user=await UserModel.find({})
        //console.log(user)
        req.user.friends.forEach((friend)=>{
            user.forEach((user)=>{
                if(friend.friend.toString()===user._id.toString() && !friends.includes(user)){
                    //console.log(user)
                    friends.push(user)
                }
            })
        })
        res.status(200).send(friends)
        
    }catch(e){

        res.status(400).send({"error":e})
    }
})
module.exports=routes