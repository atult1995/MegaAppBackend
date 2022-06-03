const mongoose=require('mongoose')

const UserChatSchema=new mongoose.Schema({
    userOneId:{
        type:mongoose.Schema.Types.ObjectId
    },
    userTwoId:{
        type:mongoose.Schema.Types.ObjectId
    },
    chats:[{
        message:{
            type:String,
            trim:true
        },
        image:{
            type:Buffer,
            trim:true
        },
        typedBy:{
            type:mongoose.Schema.Types.ObjectId
        },
        filename:{
            type:String
            ,trim:true
        }
    }]
})
const UserChatModel=mongoose.model('userchatmodel',UserChatSchema)
module.exports=UserChatModel