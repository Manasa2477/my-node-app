const express=require('express')
const router=express.Router()
const Authcontroller=require('../controller/Authcontroller')
 router.post('/login',Authcontroller.login)
 router.post('/verifypin',Authcontroller.verifypin)
 router.post('/createpin',Authcontroller.createpin)
 
module.exports=router