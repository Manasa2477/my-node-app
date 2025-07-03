const express=require('express')
const userroute=require('./routes/userroutes')
const authroute=require('./routes/Authroutes')
const settingroute=require('./routes/settingroutes')
const app=express()
app.use(express.json())
const port=2000
app.use('/userroutes',userroute)
app.use('/authroutes',authroute)
app.use('/settingroutes',settingroute)
app.listen(port,()=>{
    console.log(port)
})