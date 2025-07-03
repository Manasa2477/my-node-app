const { connect } = require("../configuration/sqlserver");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const crypto=require("crypto")
const {hashnumber}=require("../cryptonumber")
const {
  Validatephno,
  Validatepin,
  Validationemail,
} = require("../validations");
const { v4: uuidv4 } = require("uuid");
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, "9876@#%@##!#", {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign({ id: userId }, "manasa!@!1311212", {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
};
const login = async (req, res) => {
  try {
    const { phoneNumber, email } = req.body;
    var hashedPhonenumber=null
    if (!phoneNumber && !email) {
      return res.json({ message: "getting Invalid phone number and email" });
    }
    if (phoneNumber) {
      if (!Validatephno(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
      else{
        hashedPhonenumber=hashnumber(phoneNumber)
      }
    }
    if (email) {
      if (!Validationemail(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }
    }
    const pool = await connect();
    const result = await pool
      .request()
      .input("phoneNumber", sql.VarChar, hashedPhonenumber || null)
      .input("email", sql.VarChar, email || null)
      .query(
        `SELECT * FROM USERs WHERE (@phoneNumber IS NOT NULL AND phoneNumber = @phoneNumber)
       OR (@email IS NOT NULL AND email = @email)`
      );

    // console.log(result);
    const user = result.recordset[0];

    if (user) {
      return res.json({ message: "User exists", existed: true });
    } else {
      res.json({ message: "User not found", existed: false });
    }
  } catch (err) {
    console.error("error fetching:", err);
    res.status(500).json({ error: "failed to fetch" });
  }
};
const verifypin = async (req, res) => {
  try {
    const { phoneNumber, pin } = req.body;
    var hashedPhonenumber=hashnumber(phoneNumber)

    // if (
    //   !Validatephno(phoneNumber) ||
    //   !Validatepin(pin) ||
    //   !Validationemail(email)
    // ) {
    //   return res.json({
    //     message: " Getting Invalid phone number,pin and email ",
    //   });
    // }

    const pool = await connect();
    const result = await pool
      .request()
      .input("phoneNumber", sql.VarChar, hashedPhonenumber)
      .input("pin", sql.VarChar, pin)
      
      .query(
        `SELECT * FROM USERs WHERE phoneNumber = @phoneNumber AND pin = @pin `
      );

    const user = result.recordset[0];
    const tokens = generateTokens(user.userId);

    if (user) {
      res.json({ message: "Login Succesfully", tokens });
    } else {
      res.status(401).json({ message: "Login Failed" });
    }
  } catch (err) {
    console.error("Error fetching:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
const createpin = async (req, res) => {
  try {
    const { phoneNumber, pin, email } = req.body;
   var hashedPhonenumber =null
    
    if (!phoneNumber && !email) {
      return res
        .status(400)
        .json({ message: "Invalid phone number or email and pin is required" });
    }
    if (phoneNumber) {
      if (!Validatephno(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
      else{
        hashedPhonenumber = hashnumber(phoneNumber)
      }
    }
    if (email) {
      if (!Validationemail(email)) {
        return res.status(400).json({ message: "Invalid email" });
      }
    }
    if (!Validatepin(pin)) {
      return res.status(400).json({ message: "pin is required" });
    }

    var userUniqueId = uuidv4();
    const pool = await connect();
    if (phoneNumber != "" || email != "") {
      const userDetails = await pool
        .request()
        .input("phoneNumber", sql.VarChar, hashedPhonenumber || null)
        .input("email", sql.VarChar, email || null).query(`
    SELECT * FROM USERs 
    WHERE (@phoneNumber IS NOT NULL AND phoneNumber = @phoneNumber)
       OR (@email IS NOT NULL AND email = @email)
  `);

      console.log("User check result:", userDetails.recordset);

      if (userDetails.recordset.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }
    }
    // Insert user into database
    const result = await pool
      .request()
      .input("phoneNumber", sql.VarChar, hashedPhonenumber)
      .input("pin", sql.VarChar, pin)
      .input("userId", sql.VarChar, userUniqueId)
      .input("email", sql.VarChar, email)
      .query(
        `INSERT INTO USERs(userId, phoneNumber, pin,email) VALUES (@userId, @phoneNumber, @pin,@email)`
      );

    // Check if a row was inserted
    if (result.rowsAffected[0] === 1) {
      const tokens = generateTokens(userUniqueId);
      return res.json({
        message: "User created and logged in successfully",
        tokens,
      });
    } else {
      return res.status(500).json({ message: "User creation failed" });
    }
  } catch (err) {
    console.error("Error in createpin:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  login,
  verifypin,
  createpin,

};
