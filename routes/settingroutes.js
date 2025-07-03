const express=require('express')
const router=express.Router()
const settingcontroller=require("../controller/settingcontroller");
const verifyToken = require('../configuration/middleware');
router.post("/updateUser", verifyToken, settingcontroller.updateUser);
router.get("/allUserdetails",verifyToken,settingcontroller.allUserdetails);
router.get("/alluserByphonenumber/:phoneNumber",verifyToken,settingcontroller. alluserByphonenumber);
router.get("/logindetailsbyid",verifyToken,settingcontroller.logindetailsbyid)
router.get("/userphonenumber",verifyToken,settingcontroller.userphonenumber)
module.exports=router