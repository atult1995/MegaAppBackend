const express=require('express')
require('./db/mongoose')
const UserRouter=require('./User/routes/UserRouter')
const UserChatRouter=require('./User/routes/UserChatRouter')
const cors=require('cors')
const port=process.env.PORT
const app=express()
app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));
app.use(express.json())
app.use(UserRouter)
app.use(UserChatRouter)

app.listen(port,()=>{
    console.log("running at",port)
})