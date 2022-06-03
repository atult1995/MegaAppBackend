const express=require('express')
const UserChatModel=require('../model/UserChat')
const UserModel=require('../model/UserEntry')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')


const routes=express.Router()

routes.post("/user/chat",auth,async(req,res)=>{
    try{
        const userOneId=req.user._id
        const userTwoId=req.body.userTwoId
        const chat=req.body.chats
        const userChatFind=await UserChatModel.find({userOneId:userOneId,userTwoId:userTwoId})
        const userChatFind2=await UserChatModel.find({userOneId:userTwoId,userTwoId:userOneId})
        console.log(userChatFind,userChatFind2)
        if(userChatFind.length==0 && userChatFind2.length==0){
            
            //new chat entry
            const userChat=new UserChatModel()
            userChat.userOneId=userOneId
            userChat.userTwoId=userTwoId
            userChat.chats=userChat.chats.concat({"message":chat,"typedBy":userOneId,"image":undefined,"filename":undefined})
            console.log("yaha",chat)
            await userChat.save()
            //console.log("hi")
            
        }else{
            if(userChatFind.length==0){
                userChatFind2[0].chats=userChatFind2[0].chats.concat({"message":chat,"typedBy":userOneId,"image":undefined,"filename":undefined})
                await userChatFind2[0].save()
            }else{
                userChatFind[0].chats=userChatFind[0].chats.concat({"message":chat,"typedBy":userOneId,"image":undefined,"filename":undefined})
                await userChatFind[0].save()
            }
            console.log("waha",chat)

        }
        res.status(200).send({suc:true})
    }catch(e){
        console.log(e)
        res.status(400).send({error:e})
    }

})
routes.get("/user/chat/:id",auth,async(req,res)=>{
    try{
        const userOneId=req.user._id
        const userTwoId=req.params.id
        const userChat1=await UserChatModel.find({userOneId:userOneId,userTwoId:userTwoId})
        const userChat2=await UserChatModel.find({userOneId:userTwoId,userTwoId:userOneId})
        if(userChat1.length>0 && userChat2.length==0){
        res.status(200).send({chat:userChat1[0].chats})
        }else if (userChat1.length==0 && userChat2.length>0){
            res.status(200).send({chat:userChat2[0].chats})
        }else if(userChat1.length>0 && userChat2.length>0){
            res.status(200).send({chat:userChat1[0].chats})
        }else if(userChat1.length==0 && userChat2.length==0){
            res.status(200).send({chat:[]})
        }

    }catch(e){
        res.status(200).send({"error":e})
    }
    
})
const upload=multer({
    limits:{
        fileSize:10000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            cb("error",false)
        }
        cb(undefined,true)
    }
})
routes.post("/user/image",auth,upload.array('image'),async(req,res)=>{
    try{
        const userOneId=req.user._id
        const userTwoId=req.body.userTwoId
        const filename=req.body.filename
        const userChatFind=await UserChatModel.find({userOneId:userOneId,userTwoId:userTwoId})
        const userChatFind2=await UserChatModel.find({userOneId:userTwoId,userTwoId:userOneId})
        if(userChatFind.length==0 && userChatFind2.length==0){
            
            //new chat entry
            const userChat=new UserChatModel()
            userChat.userOneId=userOneId
            userChat.userTwoId=userTwoId
            for(var i=0;i<req.files.length;i++){
                // const buffer=await sharp(req.files[i].buffer).resize({width:250,height:240}).png().toBuffer()
                const buffer=await sharp(req.files[i].buffer).png().toBuffer()
                userChat.chats=userChat.chats.concat({"message":undefined,"image":buffer,"typedBy":userOneId,"filename":filename[i]})
            }
            await userChat.save()
            //console.log("hi")
            
        }else{
            if(userChatFind.length==0){
                for(var i=0;i<req.files.length;i++){
                    const buffer=await sharp(req.files[i].buffer).resize({width:250,height:240}).png().toBuffer()
                    userChatFind2[0].chats=userChatFind2[0].chats.concat({"message":undefined,"image":buffer,"typedBy":userOneId,"filename":filename[i]})
                }
                await userChatFind2[0].save()
            }else{
                for(var i=0;i<req.files.length;i++){
                    const buffer=await sharp(req.files[i].buffer).resize({width:250,height:240}).png().toBuffer()
                    userChatFind[0].chats=userChatFind[0].chats.concat({"message":undefined,"image":buffer,"typedBy":userOneId,"filename":filename[i]})
                }

                await userChatFind[0].save()
            }
        }
        res.status(200).send({suc:true})
    }catch(e){
        console.log(e)
        res.status(400).send({error:e})
    }
})


module.exports=routes