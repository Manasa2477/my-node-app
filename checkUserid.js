 
 const {connect}=require("./configuration/sqlserver")
 const sql = require("mssql");
 
 const checkuserid=async(userId)=>{
    const pool = await connect();
    const userDetails = await pool
      .request()
      .input("userId", sql.VarChar, userId).query(`
       SELECT * FROM USERs WHERE userId = @userId
      `);
    return userDetails;
}
module.exports={checkuserid};