const { connect } = require("../configuration/sqlserver");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { hashnumber } = require("../cryptonumber");
const { Validatephno } = require("../validations");
const {checkuserid}= require("../checkUserid")

const updateUser = async (req, res) => {
  try {
     const userId = req.user.id;
    const user = await checkuserid(userId);
    console.log("user details",user)  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     const pool = await connect();
    const { phoneNumber,pin } = req.body;

    var hashedPhonenumber = null;
    if (!Validatephno(phoneNumber)) {
      return res.json({
        message: " Getting Invalid phone number,pin and email ",
      });
    } else {
      hashedPhonenumber = hashnumber(phoneNumber);
    }

    const result = await pool
      .request()
      .input("phoneNumber", sql.VarChar, hashedPhonenumber)
      .input("userId", sql.VarChar,userId)
      .input("pin",sql.VarChar,pin)
      .query(`UPDATE USERs SET phoneNumber=@phoneNumber,pin=@pin WHERE userId=@userId`);
      // console.log(result.recordset)
      // return res.json({message:"updated details:",result})
    if (result.rowsAffected[0] === 1) {
      return res.json({
        message: "User updated successfully",
      });
    } else {
      return res.status(500).json({ message: "User updation failed" });
    }
  } catch (err) {
    console.error("Error in updateuser:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const allUserdetails = async (req, res) => {
  try {
   
    const pool = await connect();

    const result = await pool
      .request()
      .execute('GETALLUSERS')
      // .query(`SELECT * FROM USERs `);
      //  console.log("User details:", result.recordset);
      return res.json({message:"alluserdetails",result})
  } catch (err) {
    console.error("Error in fetching userdetails:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const alluserByphonenumber= async(req,res) =>{
  try{
    const {phoneNumber}=req.params
    console.log(phoneNumber,"jhkhfiu")
     const pool=await connect()
     const result=await pool.request()
     .input("phoneNumber",sql.VarChar,phoneNumber)
    //  .query(`select * from USERs where phoneNumber=@phoneNumber`)
    .execute('GETDETAILSBYPHNENO')
    //  console.log("user deatils by phno",result.recordset);
    return res.json({message:"alluserdetailsbyphne",result})

  }
  catch(err){
    console.error("Error in fetching the user by phno:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  
}
const logindetailsbyid=async(req,res)=>{
  try{
     const userId = req.user.id;
      const user = await checkuserid(userId);
    console.log("user details",user)  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const pool = await connect();
    const userDetails = await pool
      .request()
      .input("userId", sql.VarChar, userId).query(`
       SELECT * FROM USERs WHERE userId = @userId
      `);
  //  console.log(userDetails)
  return res.json({message:"logindetails",userDetails})
      }
      catch(err){
        console.error("Error in fetching the user by id:", err);
    return res.status(500).json({ error: "Internal Server Error" });
      }
    }
    const userphonenumber=async(req,res)=>{
      try{
        const userId =req.user.id;
        const user = await checkuserid(userId);
    console.log("user details",user)  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
      
      const pool = await connect()
      const result=await pool.request()
      .input("userId",sql.VarChar,userId)
      .query(`select phoneNumber from USERs where userId=@userId`);
      return res.json({message:"phonenumber is",result})
    }
    catch(err){
       console.error("Error in fetching phonenumber by id:", err);
    return res.status(500).json({ error: "Internal Server Error" });
    }
  }
module.exports = {
  updateUser,
  allUserdetails,
  alluserByphonenumber,
  logindetailsbyid,
  userphonenumber
  
};
