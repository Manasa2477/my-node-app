const express=require('express')
const router=express.Router()
const uploads = require('../multerconfig/config')
const usercontroller=require('../controller/usercontroller')
router.get('/alluser',usercontroller.getUser)
 router.post('/insertuser',usercontroller.Insertusers)
router.delete('/deleteuser',usercontroller.deleteUser)
router.get('/search/:search',usercontroller.search)
 router.put('/updateuser/:id',usercontroller.updateUser)
router.post('/upload', uploads.single('file'), usercontroller.fileupdate);
module.exports = router